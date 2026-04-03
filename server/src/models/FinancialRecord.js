import mongoose from "mongoose";
import { RECORD_TYPES } from "../utils/constants.js";

const financialRecordSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 0.01
    },
    type: {
      type: String,
      enum: Object.values(RECORD_TYPES),
      required: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    occurredAt: {
      type: Date,
      required: true
    },
    notes: {
      type: String,
      default: "",
      trim: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    deletedAt: {
      type: Date,
      default: null
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  {
    timestamps: true
  }
);

financialRecordSchema.index({ occurredAt: -1, type: 1, category: 1 });

export const FinancialRecord = mongoose.model("FinancialRecord", financialRecordSchema);

