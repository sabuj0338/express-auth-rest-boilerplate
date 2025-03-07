import mongoose, { Document, Model } from "mongoose";
import { paginate, QueryResult } from "../utils/pagination";
import { toJSON } from "../utils/toJson";

export interface IOutgoing {
  userId: number;
  sampleType: string;
  quantity: number;
  companyName: string;
  receiverName: string;
  date: string;
  status: string;
}

export interface IOutgoingDoc extends IOutgoing, Document {}

export interface IOutgoingModel extends Model<IOutgoingDoc> {
  paginate(
    filter: Record<string, any>,
    options: Record<string, any>
  ): Promise<QueryResult>;
}

const outgoingSchema = new mongoose.Schema<IOutgoingDoc, IOutgoingModel>(
  {
    userId: {
      type: Number,
      required: false,
      trim: true,
    },
    sampleType: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      required: false,
      trim: true,
    },
    receiverName: {
      type: String,
      required: false,
      trim: true,
    },
    date: {
      type: String,
      required: false,
      trim: true,
    },
    status: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
outgoingSchema.plugin(toJSON);
outgoingSchema.plugin(paginate);

const Outgoing = mongoose.model<IOutgoingDoc, IOutgoingModel>("Outgoing", outgoingSchema);

export default Outgoing;
