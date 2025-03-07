import Team from "../models/team.model";
import { IOptions, QueryResult } from "../utils/pagination";

export const queryTeams = async (
  filter: Record<string, any>,
  options: IOptions
): Promise<QueryResult> => {
  return await Team.paginate(filter, options);
};

export const seedTeams = async (data: object[]) => {
  await Team.insertMany(data);
};
