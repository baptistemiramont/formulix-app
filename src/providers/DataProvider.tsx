import {
	type PropsWithChildren,
	type ReactNode,
	useEffect,
	useState,
} from "react";

import { DataContext } from "@/contexts/DataContext";
import { useCircuit } from "@/hooks/useCircuit";
import { useCircuits } from "@/hooks/useCircuits";
import { useConstructorsChampionship } from "@/hooks/useConstructorsChampionship";
import { useDriver } from "@/hooks/useDriver";
import { useDrivers } from "@/hooks/useDrivers";
import { useDriversChampionship } from "@/hooks/useDriversChampionship";
import { useTeam } from "@/hooks/useTeam";
import { useTeams } from "@/hooks/useTeams";
import type { TCircuit, TCircuitDetailed } from "@/types/circuit";
import type { TDriver, TDriverDetailed } from "@/types/driver";
import type {
	TConstructorsChampionship,
	TDriversChampionship,
} from "@/types/standing";
import type { TTeam, TTeamDetailed } from "@/types/team";

type TError = Error | unknown | null;

export type TDataState = {
	drivers: TDriver[];
	isTeamsLoading: boolean;
	teams: TTeam[];
	teamsError: TError;
	setTeamSlug: (slug: string | null) => void;
	isTeamLoading: boolean;
	team: TTeamDetailed | null;
	teamError: TError;
	setDriverSlug: (slug: string | null) => void;
	isDriversLoading: boolean;
	driversError: TError;
	isDriverLoading: boolean;
	driver: TDriverDetailed | null;
	driverError: TError;
	isCircuitsLoading: boolean;
	circuits: TCircuit[];
	circuitsError: TError;
	setCircuitSlug: (slug: string | null) => void;
	isCircuitLoading: boolean;
	circuit: TCircuitDetailed | null;
	circuitError: TError;
	// Null for the current season
	setChampionshipSeason: (season: number | null) => void;
	isDriversChampionshipLoading: boolean;
	driversChampionship: TDriversChampionship | null;
	driversChampionshipError: TError;
	isConstructorsChampionshipLoading: boolean;
	constructorsChampionship: TConstructorsChampionship | null;
	constructorsChampionshipError: TError;
};

export const DataProvider = ({ children }: PropsWithChildren): ReactNode => {
	const [drivers, setDrivers] = useState<TDriver[]>([]);
	const [driverSlug, setDriverSlug] = useState<string | null>(null);
	const [driver, setDriver] = useState<TDriverDetailed | null>(null);
	const [teams, setTeams] = useState<TTeam[]>([]);
	const [teamSlug, setTeamSlug] = useState<string | null>(null);
	const [team, setTeam] = useState<TTeamDetailed | null>(null);
	const [circuits, setCircuits] = useState<TCircuit[]>([]);
	const [circuitSlug, setCircuitSlug] = useState<string | null>(null);
	const [circuit, setCircuit] = useState<TCircuitDetailed | null>(null);
	const [championshipSeason, setChampionshipSeason] = useState<number | null>(
		null
	);
	const [driversChampionship, setDriversChampionship] =
		useState<TDriversChampionship | null>(null);
	const [constructorsChampionship, setConstructorsChampionship] =
		useState<TConstructorsChampionship | null>(null);

	const {
		data: driversData,
		isLoading: isDriversLoading,
		error: driversError,
	} = useDrivers();

	const {
		data: driverData,
		isLoading: isDriverLoading,
		error: driverError,
	} = useDriver(driverSlug ? driverSlug : "");

	const {
		data: teamsData,
		isLoading: isTeamsLoading,
		error: teamsError,
	} = useTeams();

	const {
		data: teamData,
		isLoading: isTeamLoading,
		error: teamError,
	} = useTeam(teamSlug ? teamSlug : "");

	const {
		data: circuitsData,
		isLoading: isCircuitsLoading,
		error: circuitsError,
	} = useCircuits();

	const {
		data: circuitData,
		isLoading: isCircuitLoading,
		error: circuitError,
	} = useCircuit(circuitSlug ? circuitSlug : "");

	const {
		data: driversChampionshipData,
		isLoading: isDriversChampionshipLoading,
		error: driversChampionshipError,
	} = useDriversChampionship(championshipSeason);

	const {
		data: constructorsChampionshipData,
		isLoading: isConstructorsChampionshipLoading,
		error: constructorsChampionshipError,
	} = useConstructorsChampionship(championshipSeason);

	useEffect(() => {
		if (driversData) {
			setDrivers(driversData as TDriver[]);
		}
	}, [driversData]);

	useEffect(() => {
		if (driverData) {
			setDriver(driverData as TDriverDetailed);
		}
	}, [driverData]);

	useEffect(() => {
		if (teamsData) {
			setTeams(teamsData as TTeam[]);
		}
	}, [teamsData]);

	useEffect(() => {
		if (teamData) {
			setTeam(teamData);
		}
	}, [teamData]);

	useEffect(() => {
		if (circuitsData) {
			setCircuits(circuitsData);
		}
	}, [circuitsData]);

	useEffect(() => {
		if (circuitData) {
			setCircuit(circuitData);
		}
	}, [circuitData]);

	useEffect(() => {
		if (driversChampionshipData) {
			setDriversChampionship(driversChampionshipData);
		}
	}, [driversChampionshipData]);

	useEffect(() => {
		if (constructorsChampionshipData) {
			setConstructorsChampionship(constructorsChampionshipData);
		}
	}, [constructorsChampionshipData]);

	return (
		<DataContext.Provider
			children={children}
			value={{
				drivers,
				isTeamsLoading,
				teams,
				teamsError,
				setTeamSlug,
				isTeamLoading,
				team,
				teamError,
				isDriversLoading,
				driversError,
				setDriverSlug,
				isDriverLoading,
				driver,
				driverError,
				isCircuitsLoading,
				circuits,
				circuitsError,
				setCircuitSlug,
				isCircuitLoading,
				circuit,
				circuitError,
				setChampionshipSeason,
				isDriversChampionshipLoading,
				driversChampionship,
				driversChampionshipError,
				isConstructorsChampionshipLoading,
				constructorsChampionship,
				constructorsChampionshipError,
			}}
		/>
	);
};
