import mongoose, { Document, Model } from "mongoose";
import { paginate, QueryResult } from "../utils/pagination";
import { toJSON } from "../utils/toJson";

export interface ITeam {
  name: string;
  description: string;
  count: number;
}

export interface ITeamDoc extends ITeam, Document {}

export interface ITeamModel extends Model<ITeamDoc> {
  paginate(
    filter: Record<string, any>,
    options: Record<string, any>
  ): Promise<QueryResult>;
}

const teamSchema = new mongoose.Schema<ITeamDoc, ITeamModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    count: {
      type: Number,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
teamSchema.plugin(toJSON);
teamSchema.plugin(paginate);

const Team = mongoose.model<ITeamDoc, ITeamModel>("Team", teamSchema);

export default Team;
