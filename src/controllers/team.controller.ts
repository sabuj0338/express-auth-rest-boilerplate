import { Request, Response } from "express";
import status from "http-status";
import * as teamService from "../services/team.service";
import { catchAsync } from "../utils/catchAsync";
import { IOptions } from "../utils/pagination";
import { pick, pickRegex } from "../utils/pick";
import { successResponse } from "../utils/responseHandler";

export const allTeams = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const filter = pickRegex(req.query, ["name"]);
    const options: IOptions = pick(req.query, [
      "sortBy",
      "limit",
      "page",
      "projectBy",
    ]);
    const teams = await teamService.query(filter, options);
    successResponse(res, "Operation successful", status.OK, teams);
  }
);

export const teamReports = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const data: object = await teamService.getReports();
    successResponse(res, "Operation successful", status.OK, data);
  }
);

export const mockTeams = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const data: object[] = [];
    const teamNames = ["HR", "Accounts"]; // Define the array here
    Array(Number(50) ?? 10)
      .fill(0)
      .forEach((_, i) => {
        const index = i + Number(0);
        // Get a random team name
        const randomTeamName =
          teamNames[Math.floor(Math.random() * teamNames.length)];
        data.push({
          name: randomTeamName, // Use the random team name
          description: `Lorem ipsum dolor sit amet, ${index}`,
          count: Math.floor(Math.random() * 100),
        });
      });
    await teamService.seed(data);
    successResponse(res, "Operation successful", status.CREATED);
  }
);
