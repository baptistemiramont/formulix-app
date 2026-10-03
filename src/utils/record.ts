import type { TRecordCardProps, TRecordHolder } from "@/components/cards/RecordCard";
import type { TRecords } from "@/types/record";
import { getLayoutUrl } from "@/utils/circuit";
import { ROUTES } from "@/utils/constants";
import { toTeamColor } from "@/utils/team";

type TRecordsByKey = TRecords["records"];

type TDriverHolder = NonNullable<TRecordsByKey["worldTitles"]>["holders"][number];

const COUNT_FORMAT = new Intl.NumberFormat("en-GB");

// The drivers' records first, in the order the sport counts them
const DRIVER_RECORDS: {
	key: "worldTitles" | "grandPrixWins" | "podiums" | "grandPrixStarts";
	label: string;
}[] = [
	{ key: "worldTitles", label: "Most world titles" },
	{ key: "grandPrixWins", label: "Most Grand Prix wins" },
	{ key: "podiums", label: "Most podiums" },
	{ key: "grandPrixStarts", label: "Most Grand Prix starts" },
];

export function formatCount(count: number): string {
	return COUNT_FORMAT.format(count);
}

function toDriverHolder({
	firstName,
	lastName,
	slug,
	avatar,
}: TDriverHolder): TRecordHolder {
	return {
		key: slug,
		name: `${firstName} ${lastName}`,
		linkPath: ROUTES.DRIVER,
		linkParams: { driverSlug: slug },
		image: avatar,
		imageType: "avatar",
		imageAlt: `${firstName} ${lastName}'s avatar`,
	};
}

// The records someone holds, as the record cards show them
export function listRecordCards(
	records: TRecordsByKey
): (TRecordCardProps & { key: string })[] {
	const cards: (TRecordCardProps & { key: string })[] = [];

	for (const { key, label } of DRIVER_RECORDS) {
		const record = records[key];

		if (record) {
			cards.push({
				key,
				label,
				count: record.count,
				holders: record.holders.map(toDriverHolder),
			});
		}
	}

	const { constructorsTitles, grandsPrixHosted } = records;

	if (constructorsTitles) {
		const [firstTeam] = constructorsTitles.holders;

		cards.push({
			key: "constructorsTitles",
			label: "Most constructors' titles",
			count: constructorsTitles.count,
			holders: constructorsTitles.holders.map(({ name, slug, logo }) => ({
				key: slug,
				name,
				linkPath: ROUTES.TEAM,
				linkParams: { teamSlug: slug },
				image: logo,
				imageType: "logo",
				imageAlt: `${name}'s logo`,
			})),
			// A record shared between teams keeps the app's accent
			accentColor:
				constructorsTitles.holders.length === 1
					? toTeamColor(firstTeam.color)
					: undefined,
		});
	}

	if (grandsPrixHosted) {
		cards.push({
			key: "grandsPrixHosted",
			label: "Most Grands Prix hosted",
			count: grandsPrixHosted.count,
			holders: grandsPrixHosted.holders.map(({ name, slug }) => ({
				key: slug,
				name,
				linkPath: ROUTES.CIRCUIT,
				linkParams: { circuitSlug: slug },
				image: getLayoutUrl(slug),
				imageType: "layout",
				imageAlt: `${name}'s layout`,
			})),
		});
	}

	return cards;
}
