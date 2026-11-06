import type { FunctionComponent } from "react";

import { Card } from "@/components/cards/Card";
import type { TCircuit } from "@/types/circuit";
import { formatSeasons, getLayoutUrl, toFlagUrl } from "@/utils/circuit";

type TCircuitCardProps = {
	circuit: TCircuit;
};

// A circuit's card, in the list and on the map alike: its layout, its flag and its seasons, leading to its page
export const CircuitCard: FunctionComponent<TCircuitCardProps> = ({
	circuit,
}) => {
	const { name, slug, locality, country, countryCode } = circuit;
	const layoutUrl = getLayoutUrl(slug);
	const flag = {
		image: toFlagUrl(countryCode),
		alt: `${country}'s flag`,
	};

	return (
		<Card
			title={name}
			// Without a known layout, the flag takes the whole picture
			image={layoutUrl ?? flag.image}
			imageAlt={layoutUrl ? `${name}'s layout` : flag.alt}
			imageType={layoutUrl ? "layout" : "flag"}
			badge={layoutUrl ? flag : undefined}
			linkPath="/circuits/$circuitSlug"
			linkParams={{ circuitSlug: slug }}
			subtitle={`${locality} · ${formatSeasons(circuit)}`}
		/>
	);
};
