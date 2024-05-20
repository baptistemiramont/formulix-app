import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { getTeam } from "@/api/team";

export const Team = () => {
	const { id } = useParams({ from: "/teams/$id" });

	const {
		data: response,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["team"],
		queryFn: () => getTeam(id),
	});

	console.log(response);
	console.log(response.json());

	if (isLoading) return "Loading...";

	if (error) return "An error has occurred: " + error.message;

	if (response) {
		const {
			data: { name, fullName, favicon, worldChampionships, firstTeamEntry },
		} = response.json();

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
	}
};
