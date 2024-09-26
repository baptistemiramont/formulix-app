import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { getTeam } from "@/api/team";
import { Loader } from "@/components/Loader";

export const Team = () => {
	const { id } = useParams({ from: "/teams/$id" });

	const {
		data: team,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["team", id],
		queryFn: () => getTeam(id),
	});

	if (isLoading) return <Loader />;

	if (error) return "An error has occurred: " + error.message;

	const { name, fullName, favicon, worldChampionships, firstTeamEntry } = team;

	return (
		<div>
			<div>
				<img src={favicon} alt={`${name} logo`} width="100" />
			</div>
			<h1>{fullName}</h1>
			<div>
				<ul>
					<li>
						<p>
							<span>Short name : </span>
							<span>{name}</span>
						</p>
					</li>
					<li>
						<p>
							<span>World championships won : </span>
							<span>{worldChampionships}</span>
						</p>
					</li>
					<li>
						<p>
							<span>First team entry : </span>
							<span>{firstTeamEntry}</span>
						</p>
					</li>
				</ul>
			</div>
		</div>
	);
};
