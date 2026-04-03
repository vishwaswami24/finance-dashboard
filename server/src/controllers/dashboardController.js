import { getDashboardSummary } from "../services/dashboardService.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { buildRecordMatch } from "../utils/recordQuery.js";
import { validateRecordFilters } from "../utils/validation.js";

export const getSummary = asyncHandler(async (req, res) => {
  const { errors, filters } = validateRecordFilters(req.query);

  if (errors.length > 0) {
    throw new AppError(400, "Dashboard filter validation failed.", errors);
  }

  const summary = await getDashboardSummary(buildRecordMatch(filters));

  res.json(summary);
});

