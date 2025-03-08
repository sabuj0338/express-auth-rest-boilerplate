import { Request, Response } from "express";
import status from "http-status";
import moment from "moment";
import * as outgoingService from "../services/outgoing.service";
import { catchAsync } from "../utils/catchAsync";
import { IOptions } from "../utils/pagination";
import { pick } from "../utils/pick";
import { successResponse } from "../utils/responseHandler";

export const allOutgoing = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const filter = pick(req.query, ["status"]);
    const options: IOptions = pick(req.query, [
      "sortBy",
      "limit",
      "page",
      "projectBy",
    ]);

    const name = req.query.name;
    let filters = {};

    if (name) {
      const parseInt = Number.parseInt(name as string, 10);
      let conditions: any = [
        { sampleType: { $regex: name, $options: "i" } },
        { companyName: { $regex: name, $options: "i" } },
        { receiverName: { $regex: name, $options: "i" } },
      ];
      if (!isNaN(parseInt)) {
        conditions = [...conditions, { userId: { $eq: parseInt } }];
        filters = { ...filter, $or: conditions };
      } else {
        filters = { ...filter, $or: conditions };
      }
    }

    const outgoings = await outgoingService.query(filters, options);
    successResponse(res, "Operation successful", status.OK, outgoings);
  }
);

export const outgoingReports = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const data: object = await outgoingService.getReports();
    successResponse(res, "Operation successful", status.OK, data);
  }
);

export const mockOutgoing = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const data: object[] = [];

    const types = ["Light", "Water Bottles", "Bedding"]; // Define the array here
    const statues = ["Queued", "Pending", "Delivered"]; // Define the array here

    Array(Number(50) ?? 10)
      .fill(0)
      .forEach((_, i) => {
        const index = i + Number(0);
        data.push({
          userId: Math.floor(Math.random() * 1000),
          sampleType: types[Math.floor(Math.random() * types.length)],
          quantity: Math.floor(Math.random() * 100),
          companyName: `Company ${index}`,
          receiverName: `Receiver ${index}`,
          date: moment().format("YYYY-MM-DD"),
          status: statues[Math.floor(Math.random() * statues.length)],
        });
      });
    await outgoingService.seed(data);
    successResponse(res, "Operation successful", status.CREATED);
  }
);
