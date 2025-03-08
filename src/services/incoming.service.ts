import Incoming from "../models/incoming.model";
import { IOptions, QueryResult } from "../utils/pagination";

export const query = async (
  filter: Record<string, any>,
  options: IOptions
): Promise<QueryResult> => {
  return await Incoming.paginate(filter, options);
};

export const getReports = async (): Promise<object> => {
  const result = await Incoming.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        pending: {
          $sum: {
            $cond: { if: { $eq: ["$status", "Pending"] }, then: 1, else: 0 },
          },
        },
        queued: {
          $sum: {
            $cond: { if: { $eq: ["$status", "Queued"] }, then: 1, else: 0 },
          },
        },
        delivered: {
          $sum: {
            $cond: { if: { $eq: ["$status", "Delivered"] }, then: 1, else: 0 },
          },
        },
      },
    },
    {
      $project: {
        _id: 0, // Exclude _id from the output
        total: 1,
        pending: 1,
        queued: 1,
        delivered: 1,
      },
    },
  ]);

  // Handle the case where no documents match (empty result)
  if (result.length === 0) {
    return {
      total: 0,
      pending: 0,
      queued: 0,
      delivered: 0,
    };
  }

  return result[0];
};

export const seed = async (data: object[]) => {
  await Incoming.insertMany(data);
};
