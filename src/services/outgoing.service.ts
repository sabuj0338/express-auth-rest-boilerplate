import Outgoing from "../models/outgoing.model";
import { IOptions, QueryResult } from "../utils/pagination";

export const queryOutgoing = async (
  filter: Record<string, any>,
  options: IOptions
): Promise<QueryResult> => {
  return await Outgoing.paginate(filter, options);
};

export const seedOutgoing = async (data: object[]) => {
  await Outgoing.insertMany(data);
};
