import Incoming from "../models/incoming.model";
import { IOptions, QueryResult } from "../utils/pagination";

export const queryIncoming = async (
  filter: Record<string, any>,
  options: IOptions
): Promise<QueryResult> => {
  return await Incoming.paginate(filter, options);
};

export const seedIncoming = async (data: object[]) => {
  await Incoming.insertMany(data);
};
