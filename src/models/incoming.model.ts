import mongoose, { Document, Model } from "mongoose";
import { paginate, QueryResult } from "../utils/pagination";
import { toJSON } from "../utils/toJson";

export interface IIncoming {
  userId: number;
  sampleType: string;
  quantity: number;
  companyName: string;
  receiverName: string;
  date: string;
  status: string;
}

export interface IIncomingDoc extends IIncoming, Document {}

export interface IIncomingModel extends Model<IIncomingDoc> {
  paginate(
    filter: Record<string, any>,
    options: Record<string, any>
  ): Promise<QueryResult>;
}

const incomingSchema = new mongoose.Schema<IIncomingDoc, IIncomingModel>(
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
incomingSchema.plugin(toJSON);
incomingSchema.plugin(paginate);

const Incoming = mongoose.model<IIncomingDoc, IIncomingModel>("Incoming", incomingSchema);

export default Incoming;
