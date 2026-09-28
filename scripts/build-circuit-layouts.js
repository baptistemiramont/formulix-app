// Draws each circuit's layout as a single-line SVG, from the GeoJSON of bacinger/f1-circuits (MIT)
// Usage: npm run build-circuit-layouts, then commit src/assets/circuits
import { mkdir, writeFile } from "node:fs/promises";

// Pinned: a new version of the dataset is a choice, not a surprise
const DATASET_URL =
	"https://raw.githubusercontent.com/bacinger/f1-circuits/394d8fbe70ef2c0b0c8d23ff7bee61fa09606055/f1-circuits.geojson";

const OUTPUT_DIR = new URL("../src/assets/circuits/", import.meta.url);

// The dataset's layout ids, by Formulix circuit slug
const LAYOUT_IDS = {
	"albert-park": "au-1953",
	americas: "us-2012",
	bahrain: "bh-2002",
	baku: "az-2016",
	catalunya: "es-1991",
	estoril: "pt-1972",
	galvez: "ar-1952",
	hockenheimring: "de-1932",
	hungaroring: "hu-1986",
	imola: "it-1953",
	indianapolis: "us-1909",
	interlagos: "br-1940",
	istanbul: "tr-2005",
	jacarepagua: "br-1977",
	jeddah: "sa-2021",
	kyalami: "za-1961",
	losail: "qa-2004",
	madring: "es-2026",
	"magny-cours": "fr-1960",
	"marina-bay": "sg-2008",
	miami: "us-2022",
	monaco: "mc-1929",
	monza: "it-1922",
	mugello: "it-1914",
	nurburgring: "de-1927",
	portimao: "pt-2008",
	"red-bull-ring": "at-1969",
	ricard: "fr-1969",
	rodriguez: "mx-1962",
	sepang: "my-1999",
	shanghai: "cn-2004",
	silverstone: "gb-1948",
	sochi: "ru-2014",
	spa: "be-1925",
	suzuka: "jp-1962",
	vegas: "us-2023",
	villeneuve: "ca-1978",
	"watkins-glen": "us-1956",
	"yas-marina": "ae-2009",
	zandvoort: "nl-1948",
};

// The longest side of the drawing, in viewBox units
const SIZE = 100;
const STROKE_WIDTH = 3;

/**
 * Projects longitudes and latitudes onto a plane, keeping distances true around the circuit
 * @param {number[][]} coordinates - The [longitude, latitude] points
 * @returns {number[][]} The [x, y] points, y growing southwards as in SVG
 */
function project(coordinates) {
	const latitude =
		coordinates.reduce((sum, [, lat]) => sum + lat, 0) / coordinates.length;
	const scale = Math.cos((latitude * Math.PI) / 180);

	return coordinates.map(([lon, lat]) => [lon * scale, -lat]);
}

/**
 * Draws a layout as an SVG fitting a SIZE square, with room for the stroke
 * @param {number[][]} coordinates - The [longitude, latitude] points of the layout
 * @returns {string} The SVG
 */
function drawLayout(coordinates) {
	const points = project(coordinates);
	const xs = points.map(([x]) => x);
	const ys = points.map(([, y]) => y);
	const [minX, minY] = [Math.min(...xs), Math.min(...ys)];
	const ratio =
		(SIZE - STROKE_WIDTH) /
		Math.max(Math.max(...xs) - minX, Math.max(...ys) - minY);
	const margin = STROKE_WIDTH / 2;
	const scaled = points.map(([x, y]) => [
		((x - minX) * ratio + margin).toFixed(1),
		((y - minY) * ratio + margin).toFixed(1),
	]);
	const width = Math.max(...scaled.map(([x]) => Number(x))) + margin;
	const height = Math.max(...scaled.map(([, y]) => Number(y))) + margin;
	const path = `M${scaled.map(([x, y]) => `${x} ${y}`).join("L")}Z`;

	return [
		"<!-- Layout from bacinger/f1-circuits, MIT licence, see LICENSE.md -->",
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width.toFixed(1)} ${height.toFixed(1)}">`,
		`<path d="${path}" fill="none" stroke="#000" stroke-width="${STROKE_WIDTH}" stroke-linejoin="round" stroke-linecap="round"/>`,
		"</svg>",
		"",
	].join("\n");
}

const response = await fetch(DATASET_URL);

if (!response.ok) {
	throw new Error(`The dataset answered ${response.status}`);
}

const { features } = await response.json();
const layouts = new Map(
	features.map(({ properties, geometry }) => [
		properties.id,
		geometry.coordinates,
	])
);

await mkdir(OUTPUT_DIR, { recursive: true });

for (const [slug, layoutId] of Object.entries(LAYOUT_IDS)) {
	if (!layouts.has(layoutId)) {
		throw new Error(`No layout ${layoutId} in the dataset for ${slug}`);
	}

	await writeFile(
		new URL(`${slug}.svg`, OUTPUT_DIR),
		drawLayout(layouts.get(layoutId))
	);
}

console.log(`✅ ${Object.keys(LAYOUT_IDS).length} layouts drawn`);
