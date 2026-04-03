function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function buildRecordMatch(filters = {}) {
  const match = {
    deletedAt: null
  };

  if (filters.type) {
    match.type = filters.type;
  }

  if (filters.category) {
    match.category = new RegExp(`^${escapeRegex(filters.category)}$`, "i");
  }

  if (filters.startDate || filters.endDate) {
    match.occurredAt = {};
    if (filters.startDate) {
      match.occurredAt.$gte = filters.startDate;
    }
    if (filters.endDate) {
      match.occurredAt.$lte = filters.endDate;
    }
  }

  if (filters.search) {
    const searchRegex = new RegExp(escapeRegex(filters.search), "i");
    match.$or = [{ category: searchRegex }, { notes: searchRegex }];
  }

  return match;
}
