// The world as the circuits map draws it: Miller's projection, a familiar world whose shapes hold around Europe,
// from the north of Greenland down past Cape Horn
const NORTH_LATITUDE = 80;
const SOUTH_LATITUDE = -57;

// The map's width in its own units, the height following from the projection
export const MAP_WIDTH = 1000;

const UNITS_PER_RADIAN = MAP_WIDTH / (2 * Math.PI);

function toMillerY(latitude: number): number {
	const radians = (latitude * Math.PI) / 180;

	return 1.25 * Math.log(Math.tan(Math.PI / 4 + 0.4 * radians));
}

const TOP = toMillerY(NORTH_LATITUDE);

export const MAP_HEIGHT = (TOP - toMillerY(SOUTH_LATITUDE)) * UNITS_PER_RADIAN;

// Where a point of the globe falls on the map, y growing southwards as in SVG
export function project(longitude: number, latitude: number): [number, number] {
	return [
		((longitude + 180) / 360) * MAP_WIDTH,
		(TOP - toMillerY(latitude)) * UNITS_PER_RADIAN,
	];
}

// Draws the lines scripts/build-world-map.js writes: steps on a grid from one point to the next, the first from 0, 0
export function toPath(
	lines: number[][],
	stepsPerDegree: number,
	isClosed: boolean
): string {
	return lines
		.map((steps) => {
			const points: string[] = [];
			let [longitude, latitude] = [0, 0];

			for (let index = 0; index < steps.length; index += 2) {
				longitude += steps[index];
				latitude += steps[index + 1];

				const [x, y] = project(
					longitude / stepsPerDegree,
					latitude / stepsPerDegree
				);

				points.push(`${x.toFixed(2)} ${y.toFixed(2)}`);
			}

			return `M${points.join("L")}${isClosed ? "Z" : ""}`;
		})
		.join("");
}

// Closer than this, two circuits stay one on the other even at the closest zoom: the two Las Vegas, Zeltweg and the Red Bull Ring
const SAME_SPOT_DEGREES = 0.25;

// How far apart the circuits of one spot are drawn, on screen
const SPREAD_PX = 8;

type TPlace = { slug: string; latitude: number; longitude: number };

// Spreads the circuits of one spot around it, a few pixels apart whatever the zoom: each of them stays within reach
export function spreadSameSpots(
	places: TPlace[]
): Map<string, [number, number]> {
	const spots: TPlace[][] = [];

	for (const place of places) {
		const near = spots.filter((spot) =>
			spot.some(
				(other) =>
					Math.hypot(
						place.longitude - other.longitude,
						place.latitude - other.latitude
					) < SAME_SPOT_DEGREES
			)
		);
		const merged = [place, ...near.flat()];

		near.forEach((spot) => spots.splice(spots.indexOf(spot), 1));
		spots.push(merged);
	}

	const offsets = new Map<string, [number, number]>();

	for (const spot of spots) {
		if (spot.length < 2) continue;

		// The same places whatever the order the list comes in: west to east, then north to south
		const ordered = [...spot].sort(
			(a, b) => a.longitude - b.longitude || b.latitude - a.latitude
		);

		ordered.forEach(({ slug }, index) => {
			const angle = Math.PI + (2 * Math.PI * index) / ordered.length;

			offsets.set(slug, [
				Math.cos(angle) * SPREAD_PX,
				Math.sin(angle) * SPREAD_PX,
			]);
		});
	}

	return offsets;
}
