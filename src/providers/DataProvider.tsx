import {
	type PropsWithChildren,
	type ReactNode,
	useEffect,
	useState,
} from "react";

import { DataContext } from "@/contexts/DataContext";
import { useDriver } from "@/hooks/useDriver";
import { useDrivers } from "@/hooks/useDrivers";
import { useTeam } from "@/hooks/useTeam";
import { useTeams } from "@/hooks/useTeams";
import type { TDriver, TDriverDetailed } from "@/types/driver";
import type { TTeam, TTeamDetailed } from "@/types/team";

type TError = Error | unknown | null;

export type TDataState = {
	filteredDrivers: TDriver[];
	resetFilteredDrivers: () => void;
	isTeamsLoading: boolean;
	teams: TTeam[];
	teamsError: TError;
	setTeamSlug: (slug: string | null) => void;
	isTeamLoading: boolean;
	team: TTeamDetailed | null;
	teamError: TError;
	setFilteredDrivers: (drivers: TDriver[]) => void;
	filterByTeam: (teamSlug: string) => void;
	setDriverSlug: (slug: string | null) => void;
	isDriversLoading: boolean;
	driversError: TError;
	isDriverLoading: boolean;
	driver: TDriverDetailed | null;
	driverError: TError;
};

export const DataProvider = ({ children }: PropsWithChildren): ReactNode => {
	const [drivers, setDrivers] = useState<TDriver[]>([]);
	const [driverSlug, setDriverSlug] = useState<string | null>(null);
	const [driver, setDriver] = useState<TDriverDetailed | null>(null);
	const [filteredDrivers, setFilteredDrivers] = useState<TDriver[]>([]);
	const [teams, setTeams] = useState<TTeam[]>([]);
	const [teamSlug, setTeamSlug] = useState<string | null>(null);
	const [team, setTeam] = useState<TTeamDetailed | null>(null);

	function filterByTeam(teamSlug: string): void {
		if (!teamSlug || teamSlug === "") {
			setFilteredDrivers(drivers);
			return;
		}

		const filtered = drivers.filter(
			(driver) => driver.currentTeam.slug === teamSlug
		);

		setFilteredDrivers(filtered);
	}

	function resetFilteredDrivers(): void {
		setFilteredDrivers(drivers);
	}

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

	useEffect(() => {
		if (driversData) {
			setDrivers(driversData as TDriver[]);
			setFilteredDrivers(driversData as TDriver[]);
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

	return (
		<DataContext.Provider
			children={children}
			value={{
				filteredDrivers,
				resetFilteredDrivers,
				isTeamsLoading,
				teams,
				teamsError,
				setTeamSlug,
				isTeamLoading,
				team,
				teamError,
				setFilteredDrivers,
				filterByTeam,
				isDriversLoading,
				driversError,
				setDriverSlug,
				isDriverLoading,
				driver,
				driverError,
			}}
		/>
	);
};
