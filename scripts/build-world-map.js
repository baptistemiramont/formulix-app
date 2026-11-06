// Draws the land and the borders the circuits map stands on, from Natural Earth's 1:50m data (public domain)
// Usage: npm run build-world-map, then commit src/assets/world-map.json
import { writeFile } from "node:fs/promises";

// Pinned: a new version of the dataset is a choice, not a surprise
const DATASET_URL =
	"https://raw.githubusercontent.com/nvkelso/natural-earth-vector/ca96624a56bd078437bca8184e78163e5039ad19/geojson";

const OUTPUT_FILE = new URL("../src/assets/world-map.json", import.meta.url);

// Steps per degree the coordinates are rounded to: 0.05°, about 5 km
const GRID = 20;

// A point closer than this to the line its neighbours draw adds nothing at the map's closest zoom, in degrees
const TOLERANCE = 0.05;

// Antarctica lies below the map, which ends past Cape Horn
const SOUTHERNMOST_LAND = -60;

/**
 * Fetches a layer of the dataset
 * @param {string} name - The layer, e.g. "ne_50m_land"
 * @returns {Promise<object[]>} Its features
 */
async function fetchLayer(name) {
	const response = await fetch(`${DATASET_URL}/${name}.geojson`);

	if (!response.ok) {
		throw new Error(`The dataset answered ${response.status} for ${name}`);
	}

	const { features } = await response.json();

	return features;
}

/**
 * Lists the lines of a layer: the rings of its polygons, or its lines
 * @param {object[]} features - The features of the layer
 * @returns {number[][][]} The lines, each a list of [longitude, latitude] points
 */
function toLines(features) {
	return features.flatMap(({ geometry: { type, coordinates } }) => {
		switch (type) {
			case "Polygon":
			case "MultiLineString":
				return coordinates;
			case "MultiPolygon":
				return coordinates.flat();
			case "LineString":
				return [coordinates];
			default:
				throw new Error(`Unexpected geometry ${type}`);
		}
	});
}

/**
 * Keeps the points of a line that move it by more than the tolerance (Douglas-Peucker)
 * @param {number[][]} line - The [longitude, latitude] points
 * @returns {number[][]} The points kept, the first and the last always
 */
function simplify(line) {
	const kept = new Set([0, line.length - 1]);
	const spans = [[0, line.length - 1]];

	while (spans.length) {
		const [first, last] = spans.pop();
		const [ax, ay] = line[first];
		const [bx, by] = line[last];
		const length = Math.hypot(bx - ax, by - ay);
		let farthest = -1;
		let farthestDistance = TOLERANCE;

		for (let index = first + 1; index < last; index++) {
			const [px, py] = line[index];
			// A ring starts and ends on the same point: the distance to it stands for the distance to the line
			const distance =
				length === 0
					? Math.hypot(px - ax, py - ay)
					: Math.abs((by - ay) * px - (bx - ax) * py + bx * ay - by * ax) /
						length;

			if (distance > farthestDistance) {
				farthest = index;
				farthestDistance = distance;
			}
		}

		if (farthest !== -1) {
			kept.add(farthest);
			spans.push([first, farthest], [farthest, last]);
		}
	}

	return line.filter((_, index) => kept.has(index));
}

/**
 * Writes a line as the steps from one point to the next, on the grid: the first one from 0, 0
 * @param {number[][]} line - The [longitude, latitude] points
 * @returns {number[]} The steps, longitude then latitude, a point merged with the one before left out
 */
function encode(line) {
	const steps = [];
	let [previousX, previousY] = [0, 0];

	for (const [longitude, latitude] of line) {
		const [x, y] = [Math.round(longitude * GRID), Math.round(latitude * GRID)];

		if (steps.length && x === previousX && y === previousY) continue;

		steps.push(x - previousX, y - previousY);
		[previousX, previousY] = [x, y];
	}

	return steps;
}

const [landFeatures, borderFeatures] = await Promise.all([
	fetchLayer("ne_50m_land"),
	fetchLayer("ne_50m_admin_0_boundary_lines_land"),
]);

const land = toLines(landFeatures)
	.filter((ring) => ring.some(([, latitude]) => latitude > SOUTHERNMOST_LAND))
	.map((ring) => encode(simplify(ring)))
	// An islet the simplification left without a surface
	.filter((steps) => steps.length >= 8);
const borders = toLines(borderFeatures)
	.map((line) => encode(simplify(line)))
	.filter((steps) => steps.length >= 4);

// A line per ring or border: a new version of the dataset shows in the diff
const lines = (name, items) =>
	`\t"${name}": [\n${items.map((steps) => `\t\t${JSON.stringify(steps)}`).join(",\n")}\n\t]`;

await writeFile(
	OUTPUT_FILE,
	`{\n\t"grid": ${GRID},\n${lines("land", land)},\n${lines("borders", borders)}\n}\n`
);

console.log(
	`✅ ${land.length} land rings and ${borders.length} borders drawn`
);
