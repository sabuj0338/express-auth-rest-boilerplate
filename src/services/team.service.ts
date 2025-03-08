import Team from "../models/team.model";
import { IOptions, QueryResult } from "../utils/pagination";

export const query = async (
  filter: Record<string, any>,
  options: IOptions
): Promise<QueryResult> => {
  return await Team.paginate(filter, options);
};

export const getReports = async (): Promise<object> => {
  const result = await Team.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        totalUsers: { $sum: `$count` },
      },
    },
    {
      $project: {
        _id: 0,
        total: 1,
        totalUsers: 1,
      },
    },
  ]);

  if (result.length === 0) {
    return {
      total: 0,
      totalUsers: 0,
    };
  }

  return result[0];
};

export const seed = async (data: object[]) => {
  await Team.insertMany(data);
};
