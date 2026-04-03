import { FinancialRecord } from "../models/FinancialRecord.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { buildRecordMatch } from "../utils/recordQuery.js";
import { validateRecordFilters, validateRecordPayload } from "../utils/validation.js";

function mapRecord(record) {
  return {
    id: record._id.toString(),
    amount: record.amount,
    type: record.type,
    category: record.category,
    occurredAt: record.occurredAt,
    notes: record.notes,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    createdBy: record.createdBy
      ? {
          id: record.createdBy._id.toString(),
          name: record.createdBy.name,
          email: record.createdBy.email,
          role: record.createdBy.role
        }
      : null,
    updatedBy: record.updatedBy
      ? {
          id: record.updatedBy._id.toString(),
          name: record.updatedBy.name,
          email: record.updatedBy.email,
          role: record.updatedBy.role
        }
      : null
  };
}

async function findRecordOrThrow(recordId) {
  const record = await FinancialRecord.findOne({
    _id: recordId,
    deletedAt: null
  })
    .populate("createdBy", "name email role")
    .populate("updatedBy", "name email role");

  if (!record) {
    throw new AppError(404, "Financial record not found.");
  }

  return record;
}

export const listRecords = asyncHandler(async (req, res) => {
  const { errors, filters, pagination } = validateRecordFilters(req.query);

  if (errors.length > 0) {
    throw new AppError(400, "Record filter validation failed.", errors);
  }

  const match = buildRecordMatch(filters);
  const skip = (pagination.page - 1) * pagination.limit;

  const [records, totalRecords] = await Promise.all([
    FinancialRecord.find(match)
      .sort({ occurredAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(pagination.limit)
      .populate("createdBy", "name email role")
      .populate("updatedBy", "name email role"),
    FinancialRecord.countDocuments(match)
  ]);

  res.json({
    records: records.map(mapRecord),
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / pagination.limit) || 1
    }
  });
});

export const getRecordById = asyncHandler(async (req, res) => {
  const record = await findRecordOrThrow(req.params.id);

  res.json({
    record: mapRecord(record)
  });
});

export const createRecord = asyncHandler(async (req, res) => {
  const { errors, value } = validateRecordPayload(req.body);

  if (errors.length > 0) {
    throw new AppError(400, "Record validation failed.", errors);
  }

  const record = await FinancialRecord.create({
    ...value,
    createdBy: req.user._id
  });

  const populatedRecord = await findRecordOrThrow(record._id);

  res.status(201).json({
    message: "Record created successfully.",
    record: mapRecord(populatedRecord)
  });
});

export const updateRecord = asyncHandler(async (req, res) => {
  const { errors, value } = validateRecordPayload(req.body, { partial: true });

  if (errors.length > 0) {
    throw new AppError(400, "Record validation failed.", errors);
  }

  const record = await FinancialRecord.findOne({
    _id: req.params.id,
    deletedAt: null
  });

  if (!record) {
    throw new AppError(404, "Financial record not found.");
  }

  Object.assign(record, value, { updatedBy: req.user._id });
  await record.save();

  const populatedRecord = await findRecordOrThrow(record._id);

  res.json({
    message: "Record updated successfully.",
    record: mapRecord(populatedRecord)
  });
});

export const deleteRecord = asyncHandler(async (req, res) => {
  const record = await FinancialRecord.findOne({
    _id: req.params.id,
    deletedAt: null
  });

  if (!record) {
    throw new AppError(404, "Financial record not found.");
  }

  record.deletedAt = new Date();
  record.deletedBy = req.user._id;
  await record.save();

  res.status(204).send();
});

