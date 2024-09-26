import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { getDriver } from "@/api/driver";
import { Loader } from "@/components/Loader";
import { css } from "@/../styled-system/css";
import { StatCard } from "@/components/cards/StatCard";

export const Driver = () => {
	const { id } = useParams({ from: "/drivers/$id" });

	const {
		data: driver,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["driver", id],
		queryFn: () => getDriver(id),
	});

	if (isLoading) return <Loader />;

	if (error) return "An error has occurred: " + error.message;

	if (!driver) return "Driver not found";

	const {
		firstName,
		lastName,
		avatar,
		country,
		worldChampionshipsTitle,
		podiums,
		grandPrixParticipation,
	} = driver;

	// Style

	const pageStyle = {
		container: css({
			paddingY: 12,
			display: "grid",
			gap: 6,
			lg: {
				gridTemplateColumns: "1fr 1fr",
				alignItems: "center",
			},
		}),
		driverPortraitContainer: css({
			display: "grid",
			justifyContent: "center",
			gap: 3,
		}),
		driverAvatarContainer: css({
			display: "grid",
			justifyContent: "center",
		}),
		driverStatListContainer: css({
			height: "100%",
		}),
		driverStatList: css({
			height: "100%",
			display: "grid",
			gap: 6,
			md: {
				gridTemplateColumns: "repeat(2, 1fr)",
			},
		}),
	};

	return (
		<div className={pageStyle.container}>
			<div className={pageStyle.driverPortraitContainer}>
				<div className={pageStyle.driverAvatarContainer}>
					<img
						src={avatar}
						alt={`${firstName} ${lastName} avatar`}
						width="200"
						loading="lazy"
					/>
				</div>
				<h1>
					{firstName} {lastName}
				</h1>
			</div>
			<div className={pageStyle.driverStatListContainer}>
				<ul className={pageStyle.driverStatList}>
					<StatCard label="Country" value={country} />
					<StatCard
						label="World championships won"
						value={worldChampionshipsTitle}
					/>
					<StatCard label="Podiums" value={podiums} />
					<StatCard label="GP participations" value={grandPrixParticipation} />
				</ul>
			</div>
		</div>
	);
};