import type { z } from "zod";

import type { teamDetailedSchema, teamSchema } from "@/types/schemas/team";

export type TTeam = z.infer<typeof teamSchema>;

export type MinimalTeamType = {
	id: number;
	name: string;
	slug: string;
	favicon: string;
	isCurrentTeam: boolean;
};

export type TTeamDetailed = z.infer<typeof teamDetailedSchema>;
