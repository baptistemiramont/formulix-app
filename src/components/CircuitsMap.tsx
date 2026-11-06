import {
	type CSSProperties,
	type FunctionComponent,
	type KeyboardEvent,
	type MouseEvent,
	type PointerEvent,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

import { Icon } from "@iconify/react";

import { css } from "@/../styled-system/css";
import worldMap from "@/assets/world-map.json";
import { CircuitCard } from "@/components/cards/CircuitCard";
import { HapticButton } from "@/components/HapticButton";
import type { TCircuitOnMap } from "@/types/circuit";
import {
	MAP_HEIGHT,
	MAP_WIDTH,
	project,
	spreadSameSpots,
	toPath,
} from "@/utils/map";

type TCircuitsMapProps = {
	circuits: TCircuitOnMap[];
	// The circuits of the previous search, while the next ones are on their way
	isBusy: boolean;
};

type TView = { scale: number; x: number; y: number };

type TSize = { width: number; height: number };

type TPoint = { x: number; y: number };

// Drawn once, the first time the map shows
const LAND_PATH = toPath(worldMap.land, worldMap.grid, true);
const BORDERS_PATH = toPath(worldMap.borders, worldMap.grid, false);

// How much closer than the whole world the map zooms: enough to tell Imola from Mugello on a phone
const MAX_ZOOM = 16;

// A tap on + or -, or a double click
const ZOOM_STEP = 2;

// How long the map takes to get there, after a tap or a key
const ZOOM_ANIMATION_MS = 300;

// Moved further than this, a press drags the map instead of tapping it
const DRAG_THRESHOLD_PX = 5;

// A press of an arrow key
const PAN_STEP_PX = 80;

// The world covers the frame at the farthest zoom: no empty band around it
function getMinScale({ width, height }: TSize): number {
	return Math.max(width / MAP_WIDTH, height / MAP_HEIGHT);
}

function clampScale(scale: number, size: TSize): number {
	const minScale = getMinScale(size);

	return Math.min(Math.max(scale, minScale), minScale * MAX_ZOOM);
}

// Kept within the zoom's bounds, the world still covering the frame
function clampView(view: TView, size: TSize): TView {
	const scale = clampScale(view.scale, size);

	return {
		scale,
		x: Math.min(0, Math.max(size.width - MAP_WIDTH * scale, view.x)),
		y: Math.min(0, Math.max(size.height - MAP_HEIGHT * scale, view.y)),
	};
}

// The whole world, centred on Greenwich: Europe and Africa in sight on a phone, which only shows part of it
function getFittedView(size: TSize): TView {
	const scale = getMinScale(size);

	return {
		scale,
		x: (size.width - MAP_WIDTH * scale) / 2,
		y: (size.height - MAP_HEIGHT * scale) / 2,
	};
}

// Zoomed by a factor around a point of the frame, which stays under the finger or the pointer
function zoomAround(
	view: TView,
	factor: number,
	{ x, y }: TPoint,
	size: TSize
): TView {
	const scale = clampScale(view.scale * factor, size);
	const ratio = scale / view.scale;

	return clampView(
		{ scale, x: x - (x - view.x) * ratio, y: y - (y - view.y) * ratio },
		size
	);
}

function toFramePoint(
	element: HTMLElement,
	{ clientX, clientY }: { clientX: number; clientY: number }
): TPoint {
	const { left, top } = element.getBoundingClientRect();

	return { x: clientX - left, y: clientY - top };
}

function getMiddle(a: TPoint, b: TPoint): TPoint {
	return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function getDistance(a: TPoint, b: TPoint): number {
	return Math.hypot(a.x - b.x, a.y - b.y);
}

// Every circuit kept by the search and filters, a dot on the world: red when active, a ring otherwise
export const CircuitsMap: FunctionComponent<TCircuitsMapProps> = ({
	circuits,
	isBusy,
}) => {
	const viewportRef = useRef<HTMLDivElement>(null);
	const sizeRef = useRef<TSize>({ width: 0, height: 0 });
	const viewRef = useRef<TView>({ scale: 1, x: 0, y: 0 });
	const animationRef = useRef<ReturnType<typeof setTimeout>>();
	// The fingers or the mouse pressing the map, where they are now
	const pointersRef = useRef(new Map<number, TPoint>());
	// Where the fingers started from, and the view then
	const gestureRef = useRef<{
		view: TView;
		points: TPoint[];
		isDragging: boolean;
	} | null>(null);
	// A drag ends with a click, which is not a tap on the map
	const wasDraggedRef = useRef(false);
	const [zoomBounds, setZoomBounds] = useState({
		isFarthest: true,
		isClosest: false,
	});
	const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

	// A circuit the next search leaves out leaves the map with its card
	const selected = circuits.find(({ slug }) => slug === selectedSlug);

	const points = useMemo(() => {
		const spreads = spreadSameSpots(circuits);

		return (
			[...circuits]
				// The active ones over the others
				.sort((a, b) => Number(a.isActive) - Number(b.isActive))
				.map((circuit) => {
					const [x, y] = project(circuit.longitude, circuit.latitude);
					const [spreadX, spreadY] = spreads.get(circuit.slug) ?? [0, 0];

					return { circuit, x, y, spreadX, spreadY };
				})
		);
	}, [circuits]);

	// Set on the viewport itself rather than rendered: a drag moves the map at every frame without React
	const showView = useCallback((view: TView, isAnimated = false): void => {
		const viewport = viewportRef.current;

		if (!viewport) return;

		const minScale = getMinScale(sizeRef.current);

		viewRef.current = view;
		viewport.style.setProperty("--map-scale", String(view.scale));
		viewport.style.setProperty("--map-x", String(view.x));
		viewport.style.setProperty("--map-y", String(view.y));
		// Zoomed in, a swipe moves the map; at the farthest, it scrolls the page
		viewport.dataset.zoomed = String(view.scale > minScale * 1.001);

		clearTimeout(animationRef.current);
		viewport.dataset.animated = String(isAnimated);

		if (isAnimated) {
			animationRef.current = setTimeout(() => {
				viewport.dataset.animated = "false";
			}, ZOOM_ANIMATION_MS);
		}

		const isFarthest = view.scale <= minScale * 1.001;
		const isClosest = view.scale >= minScale * MAX_ZOOM * 0.999;

		setZoomBounds((bounds) =>
			bounds.isFarthest === isFarthest && bounds.isClosest === isClosest
				? bounds
				: { isFarthest, isClosest }
		);
	}, []);

	// A new frame size, such as a phone turned, shows the whole world again
	useEffect(() => {
		const viewport = viewportRef.current;

		if (!viewport) return;

		const observer = new ResizeObserver(([entry]) => {
			const { width, height } = entry.contentRect;

			sizeRef.current = { width, height };
			showView(getFittedView(sizeRef.current));
		});

		observer.observe(viewport);

		return () => {
			observer.disconnect();
			clearTimeout(animationRef.current);
		};
	}, [showView]);

	// Listened to outside of React, which cannot keep the page from scrolling
	useEffect(() => {
		const viewport = viewportRef.current;

		if (!viewport) return;

		// An arrow function keeps the viewport known here, found above
		const handleWheel = (event: WheelEvent): void => {
			const view = viewRef.current;
			const size = sizeRef.current;
			const minScale = getMinScale(size);
			const delta =
				event.deltaMode === WheelEvent.DOM_DELTA_LINE
					? event.deltaY * 16
					: event.deltaY;
			// A trackpad pinch comes as a wheel with Ctrl, in smaller steps
			const factor = Math.exp(-delta * (event.ctrlKey ? 0.01 : 0.002));
			const isAtBound =
				(factor < 1 && view.scale <= minScale * 1.001) ||
				(factor > 1 && view.scale >= minScale * MAX_ZOOM * 0.999);

			// Past the zoom's bounds, the wheel scrolls the page again; a pinch never zooms the page instead
			if (isAtBound && !event.ctrlKey) return;

			event.preventDefault();
			showView(zoomAround(view, factor, toFramePoint(viewport, event), size));
		};

		viewport.addEventListener("wheel", handleWheel, { passive: false });

		return () => viewport.removeEventListener("wheel", handleWheel);
	}, [showView]);

	// From the fingers pressing now: a single one drags, two pinch
	function startGesture(): void {
		gestureRef.current = {
			view: viewRef.current,
			points: [...pointersRef.current.values()],
			isDragging: gestureRef.current?.isDragging ?? false,
		};
	}

	function handlePointerDown(event: PointerEvent<HTMLDivElement>): void {
		if (event.pointerType === "mouse" && event.button !== 0) return;

		if (!pointersRef.current.size) {
			wasDraggedRef.current = false;
		}

		pointersRef.current.set(
			event.pointerId,
			toFramePoint(event.currentTarget, event)
		);
		startGesture();
	}

	function handlePointerMove(event: PointerEvent<HTMLDivElement>): void {
		const viewport = event.currentTarget;
		const gesture = gestureRef.current;

		if (!gesture || !pointersRef.current.has(event.pointerId)) return;

		pointersRef.current.set(event.pointerId, toFramePoint(viewport, event));

		const [first, second] = [...pointersRef.current.values()];
		const [firstStart, secondStart] = gesture.points;

		if (!gesture.isDragging) {
			if (!second && getDistance(first, firstStart) < DRAG_THRESHOLD_PX) {
				return;
			}

			// Captured once it drags only: a tap still reaches the circuit under it
			gesture.isDragging = true;
			pointersRef.current.forEach((_, pointerId) =>
				viewport.setPointerCapture(pointerId)
			);
			viewport.dataset.dragging = "true";
		}

		const { view } = gesture;
		const size = sizeRef.current;

		if (!second || !secondStart) {
			showView(
				clampView(
					{
						...view,
						x: view.x + first.x - firstStart.x,
						y: view.y + first.y - firstStart.y,
					},
					size
				)
			);
			return;
		}

		// The point of the world between the fingers stays between them
		const startMiddle = getMiddle(firstStart, secondStart);
		const middle = getMiddle(first, second);
		const startDistance = getDistance(firstStart, secondStart) || 1;
		const scale = clampScale(
			(view.scale * getDistance(first, second)) / startDistance,
			size
		);
		const ratio = scale / view.scale;

		showView(
			clampView(
				{
					scale,
					x: middle.x - (startMiddle.x - view.x) * ratio,
					y: middle.y - (startMiddle.y - view.y) * ratio,
				},
				size
			)
		);
	}

	function handlePointerEnd(event: PointerEvent<HTMLDivElement>): void {
		if (!pointersRef.current.delete(event.pointerId)) return;

		// A finger lifted from a pinch: the other one drags on from where it is
		if (pointersRef.current.size) {
			startGesture();
			return;
		}

		if (gestureRef.current?.isDragging) {
			wasDraggedRef.current = true;
			event.currentTarget.dataset.dragging = "false";
		}

		gestureRef.current = null;
	}

	// A tap on the map, away from the circuits, puts the card away
	function handleClick(): void {
		if (wasDraggedRef.current) {
			wasDraggedRef.current = false;
			return;
		}

		setSelectedSlug(null);
	}

	function handleDoubleClick(event: MouseEvent<HTMLDivElement>): void {
		showView(
			zoomAround(
				viewRef.current,
				ZOOM_STEP,
				toFramePoint(event.currentTarget, event),
				sizeRef.current
			),
			true
		);
	}

	function zoomFromCentre(factor: number): void {
		const size = sizeRef.current;

		showView(
			zoomAround(
				viewRef.current,
				factor,
				{ x: size.width / 2, y: size.height / 2 },
				size
			),
			true
		);
	}

	function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
		const view = viewRef.current;
		const moves: Record<string, [number, number]> = {
			ArrowLeft: [PAN_STEP_PX, 0],
			ArrowRight: [-PAN_STEP_PX, 0],
			ArrowUp: [0, PAN_STEP_PX],
			ArrowDown: [0, -PAN_STEP_PX],
		};

		if (event.key === "+" || event.key === "=") {
			zoomFromCentre(ZOOM_STEP);
		} else if (event.key === "-") {
			zoomFromCentre(1 / ZOOM_STEP);
		} else if (event.key === "Escape") {
			setSelectedSlug(null);
		} else if (moves[event.key]) {
			const [dx, dy] = moves[event.key];

			showView(
				clampView({ ...view, x: view.x + dx, y: view.y + dy }, sizeRef.current),
				true
			);
		} else {
			return;
		}

		event.preventDefault();
	}

	const mapStyle = {
		frame: css({
			position: "relative",
			overflow: "hidden",
			"@supports (overflow: clip)": {
				overflow: "clip",
			},
			// Tall on a phone, which shows part of the world at a time; the whole world on a computer
			aspectRatio: "4 / 5",
			backgroundColor: "surface",
			borderTopWidth: "2px",
			borderRightWidth: "2px",
			borderColor: "line",
			borderTopRightRadius: "2xl",
			transition: "var(--default-animation)",
			"&[aria-busy=true]": {
				opacity: 0.5,
			},
			sm: {
				aspectRatio: "1",
			},
			md: {
				aspectRatio: "3 / 2",
			},
			lg: {
				aspectRatio: "var(--world-ratio)",
			},
		}),
		viewport: css({
			position: "absolute",
			inset: 0,
			// Clipped rather than hidden, as the frame: focusing a circuit out of sight must not scroll the map away from its view
			overflow: "hidden",
			"@supports (overflow: clip)": {
				overflow: "clip",
			},
			// The circuit chosen rises over the others, never over the legend, the zoom or its card
			isolation: "isolate",
			cursor: "grab",
			userSelect: "none",
			WebkitUserSelect: "none",
			touchAction: "pan-y",
			"&[data-zoomed=true]": {
				touchAction: "none",
			},
			"&[data-dragging=true]": {
				cursor: "grabbing",
			},
			_focusVisible: {
				outline: "2px solid token(colors.accentText)",
				outlineOffset: "-2px",
			},
		}),
		stage: css({
			position: "absolute",
			top: 0,
			left: 0,
			transformOrigin: "0 0",
			transform:
				"translate(calc(var(--map-x) * 1px), calc(var(--map-y) * 1px)) scale(var(--map-scale))",
			"[data-animated=true] &": {
				transition: `transform ${ZOOM_ANIMATION_MS}ms ease`,
			},
		}),
		land: css({
			fill: "surfaceMuted",
		}),
		borders: css({
			fill: "none",
			stroke: "line",
			// A hairline whatever the zoom
			strokeWidth: "calc(1px / var(--map-scale))",
			strokeLinejoin: "round",
		}),
		point: css({
			"--point-fill": "token(colors.surface)",
			"--point-inner": "0 0 #0000",
			"--point-outline": "0 0 #0000",
			position: "absolute",
			left: "calc((var(--map-x) + var(--point-x) * var(--map-scale) + var(--spread-x)) * 1px)",
			top: "calc((var(--map-y) + var(--point-y) * var(--map-scale) + var(--spread-y)) * 1px)",
			display: "grid",
			placeItems: "center",
			// Wide enough for a finger, the dot itself smaller
			width: 6,
			height: 6,
			translate: "-50% -50%",
			borderRadius: "full",
			cursor: "pointer",
			WebkitTapHighlightColor: "transparent",
			_before: {
				content: "\"\"",
				width: 2.5,
				height: 2.5,
				backgroundColor: "var(--point-fill)",
				borderRadius: "full",
				// A ring of the sea keeps a dot apart from the land and from the dots under it
				boxShadow:
					"var(--point-inner), 0 0 0 2px token(colors.surface), var(--point-outline)",
				transition: "var(--default-animation)",
			},
			"&[data-active=true]": {
				"--point-fill": "token(colors.accent)",
			},
			"&[data-active=false]": {
				"--point-inner": "inset 0 0 0 2px token(colors.textMuted)",
			},
			"&:hover::before, &:focus-visible::before": {
				transform: "scale(1.4)",
			},
			_focusVisible: {
				outline: "none",
			},
			"&[aria-pressed=true]": {
				"--point-outline": "0 0 0 4px token(colors.text)",
				zIndex: 1,
			},
			"&[aria-pressed=true]::before": {
				transform: "scale(1.4)",
			},
			"[data-animated=true] &": {
				transition: `left ${ZOOM_ANIMATION_MS}ms ease, top ${ZOOM_ANIMATION_MS}ms ease`,
			},
		}),
		legend: css({
			position: "absolute",
			top: 3,
			left: 3,
			display: "flex",
			gap: 3,
			paddingY: 1,
			paddingX: 2,
			color: "textMuted",
			textStyle: "label",
			backgroundColor: "color-mix(in srgb, token(colors.surface) 85%, transparent)",
			borderRadius: "md",
			pointerEvents: "none",
		}),
		legendItem: css({
			display: "flex",
			alignItems: "center",
			gap: 1.5,
			_before: {
				content: "\"\"",
				width: 2.5,
				height: 2.5,
				borderRadius: "full",
			},
			"&[data-active=true]::before": {
				backgroundColor: "accent",
			},
			"&[data-active=false]::before": {
				boxShadow: "inset 0 0 0 2px token(colors.textMuted)",
			},
		}),
		zoom: css({
			position: "absolute",
			top: 3,
			right: 3,
			display: "grid",
			gap: 1,
			padding: 1,
			backgroundColor: "surface",
			borderWidth: "1px",
			borderColor: "line",
			borderRadius: "md",
		}),
		zoomButton: css({
			display: "grid",
			placeItems: "center",
			width: 8,
			height: 8,
			color: "textMuted",
			fontSize: 18,
			borderRadius: "sm",
			cursor: "pointer",
			transition: "var(--default-animation)",
			_hover: {
				color: "text",
				backgroundColor: "surfaceMuted",
			},
			_disabled: {
				opacity: 0.4,
				cursor: "default",
				pointerEvents: "none",
			},
		}),
		dock: css({
			position: "absolute",
			bottom: 3,
			left: 3,
			width: "10.5rem",
			md: {
				width: "13rem",
			},
			lg: {
				width: "15rem",
			},
		}),
		close: css({
			position: "absolute",
			zIndex: 1,
			top: 2,
			right: 2,
			display: "grid",
			placeItems: "center",
			width: 7,
			height: 7,
			color: "textMuted",
			fontSize: 16,
			backgroundColor: "surface",
			borderWidth: "1px",
			borderColor: "line",
			borderRadius: "full",
			cursor: "pointer",
			transition: "var(--default-animation)",
			_hover: {
				color: "text",
			},
		}),
	};

	return (
		<div
			aria-busy={isBusy}
			className={mapStyle.frame}
			style={
				{ "--world-ratio": `${MAP_WIDTH} / ${MAP_HEIGHT}` } as CSSProperties
			}
		>
			<div
				ref={viewportRef}
				role="group"
				aria-label="World map of the circuits: drag to move it, pinch, scroll or press + and - to zoom"
				tabIndex={0}
				className={mapStyle.viewport}
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerEnd}
				onPointerCancel={handlePointerEnd}
				onClick={handleClick}
				onDoubleClick={handleDoubleClick}
				onKeyDown={handleKeyDown}
			>
				<svg
					aria-hidden
					className={mapStyle.stage}
					width={MAP_WIDTH}
					height={MAP_HEIGHT}
					viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
				>
					<path className={mapStyle.land} d={LAND_PATH} />
					<path className={mapStyle.borders} d={BORDERS_PATH} />
				</svg>
				{points.map(({ circuit, x, y, spreadX, spreadY }) => (
					<button
						key={circuit.slug}
						type="button"
						className={mapStyle.point}
						data-active={circuit.isActive}
						aria-pressed={circuit.slug === selectedSlug}
						aria-label={`${circuit.name}, ${circuit.isActive ? "active" : "inactive"}`}
						title={circuit.name}
						style={
							{
								"--point-x": x,
								"--point-y": y,
								"--spread-x": spreadX,
								"--spread-y": spreadY,
							} as CSSProperties
						}
						onClick={(event) => {
							// Not a tap on the map, which would put the card away
							event.stopPropagation();
							setSelectedSlug(circuit.slug);
						}}
					/>
				))}
			</div>
			<ul className={mapStyle.legend}>
				<li className={mapStyle.legendItem} data-active>
					Active
				</li>
				<li className={mapStyle.legendItem} data-active={false}>
					Inactive
				</li>
			</ul>
			<div role="group" aria-label="Zoom" className={mapStyle.zoom}>
				<HapticButton
					type="button"
					aria-label="Zoom in"
					title="Zoom in"
					disabled={zoomBounds.isClosest}
					className={mapStyle.zoomButton}
					onClick={() => zoomFromCentre(ZOOM_STEP)}
				>
					<Icon icon="mdi:plus" />
				</HapticButton>
				<HapticButton
					type="button"
					aria-label="Zoom out"
					title="Zoom out"
					disabled={zoomBounds.isFarthest}
					className={mapStyle.zoomButton}
					onClick={() => zoomFromCentre(1 / ZOOM_STEP)}
				>
					<Icon icon="mdi:minus" />
				</HapticButton>
			</div>
			{/* Announced as it opens, for those who cannot see it */}
			<div aria-live="polite" className={mapStyle.dock}>
				{selected && (
					<>
						<ul>
							<CircuitCard circuit={selected} />
						</ul>
						<HapticButton
							type="button"
							aria-label="Close the circuit's card"
							title="Close"
							className={mapStyle.close}
							onClick={() => setSelectedSlug(null)}
						>
							<Icon icon="mdi:close" />
						</HapticButton>
					</>
				)}
			</div>
		</div>
	);
};
