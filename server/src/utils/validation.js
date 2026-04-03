import { RECORD_TYPES, ROLES, USER_STATUSES } from "./constants.js";

function isBlank(value) {
  return value === undefined || value === null || String(value).trim() === "";
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim().toLowerCase());
}

function parseDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseAmount(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}

export function validateUserPayload(payload, { partial = false } = {}) {
  const errors = [];
  const value = {};

  if (!partial || payload.name !== undefined) {
    if (isBlank(payload.name)) {
      errors.push({ field: "name", message: "Name is required." });
    } else if (String(payload.name).trim().length < 2) {
      errors.push({ field: "name", message: "Name must be at least 2 characters long." });
    } else {
      value.name = String(payload.name).trim();
    }
  }

  if (!partial || payload.email !== undefined) {
    if (isBlank(payload.email)) {
      errors.push({ field: "email", message: "Email is required." });
    } else if (!isValidEmail(payload.email)) {
      errors.push({ field: "email", message: "Email address is invalid." });
    } else {
      value.email = String(payload.email).trim().toLowerCase();
    }
  }

  if (!partial || payload.password !== undefined) {
    if (isBlank(payload.password)) {
      errors.push({ field: "password", message: "Password is required." });
    } else if (String(payload.password).length < 8) {
      errors.push({ field: "password", message: "Password must be at least 8 characters long." });
    } else {
      value.password = String(payload.password);
    }
  }

  if (!partial || payload.role !== undefined) {
    if (isBlank(payload.role)) {
      errors.push({ field: "role", message: "Role is required." });
    } else if (!Object.values(ROLES).includes(payload.role)) {
      errors.push({ field: "role", message: `Role must be one of: ${Object.values(ROLES).join(", ")}.` });
    } else {
      value.role = payload.role;
    }
  }

  if (payload.status !== undefined) {
    if (!Object.values(USER_STATUSES).includes(payload.status)) {
      errors.push({
        field: "status",
        message: `Status must be one of: ${Object.values(USER_STATUSES).join(", ")}.`
      });
    } else {
      value.status = payload.status;
    }
  } else if (!partial) {
    value.status = USER_STATUSES.ACTIVE;
  }

  return { errors, value };
}

export function validateLoginPayload(payload) {
  const errors = [];
  const value = {};

  if (isBlank(payload.email)) {
    errors.push({ field: "email", message: "Email is required." });
  } else if (!isValidEmail(payload.email)) {
    errors.push({ field: "email", message: "Email address is invalid." });
  } else {
    value.email = String(payload.email).trim().toLowerCase();
  }

  if (isBlank(payload.password)) {
    errors.push({ field: "password", message: "Password is required." });
  } else {
    value.password = String(payload.password);
  }

  return { errors, value };
}

export function validateRecordPayload(payload, { partial = false } = {}) {
  const errors = [];
  const value = {};

  if (!partial || payload.amount !== undefined) {
    const amount = parseAmount(payload.amount);
    if (amount === null) {
      errors.push({ field: "amount", message: "Amount must be a valid number." });
    } else if (amount <= 0) {
      errors.push({ field: "amount", message: "Amount must be greater than zero." });
    } else {
      value.amount = Number(amount.toFixed(2));
    }
  }

  if (!partial || payload.type !== undefined) {
    if (!Object.values(RECORD_TYPES).includes(payload.type)) {
      errors.push({
        field: "type",
        message: `Type must be one of: ${Object.values(RECORD_TYPES).join(", ")}.`
      });
    } else {
      value.type = payload.type;
    }
  }

  if (!partial || payload.category !== undefined) {
    if (isBlank(payload.category)) {
      errors.push({ field: "category", message: "Category is required." });
    } else {
      value.category = String(payload.category).trim();
    }
  }

  if (!partial || payload.occurredAt !== undefined) {
    const occurredAt = parseDate(payload.occurredAt);
    if (!occurredAt) {
      errors.push({ field: "occurredAt", message: "Date must be valid." });
    } else {
      value.occurredAt = occurredAt;
    }
  }

  if (payload.notes !== undefined) {
    const notes = String(payload.notes ?? "").trim();
    if (notes.length > 300) {
      errors.push({ field: "notes", message: "Notes must be 300 characters or fewer." });
    } else {
      value.notes = notes;
    }
  } else if (!partial) {
    value.notes = "";
  }

  return { errors, value };
}

export function validateRecordFilters(query) {
  const errors = [];
  const filters = {};
  const pagination = {
    page: 1,
    limit: 20
  };

  if (query.type !== undefined && query.type !== "") {
    if (!Object.values(RECORD_TYPES).includes(query.type)) {
      errors.push({
        field: "type",
        message: `Type must be one of: ${Object.values(RECORD_TYPES).join(", ")}.`
      });
    } else {
      filters.type = query.type;
    }
  }

  if (query.category !== undefined && query.category !== "") {
    filters.category = String(query.category).trim();
  }

  if (query.search !== undefined && query.search !== "") {
    filters.search = String(query.search).trim();
  }

  if (query.startDate) {
    const startDate = parseDate(query.startDate);
    if (!startDate) {
      errors.push({ field: "startDate", message: "startDate must be a valid date." });
    } else {
      filters.startDate = startDate;
    }
  }

  if (query.endDate) {
    const endDate = parseDate(query.endDate);
    if (!endDate) {
      errors.push({ field: "endDate", message: "endDate must be a valid date." });
    } else {
      filters.endDate = endDate;
    }
  }

  if (filters.startDate && filters.endDate && filters.startDate > filters.endDate) {
    errors.push({ field: "dateRange", message: "startDate cannot be later than endDate." });
  }

  if (query.page !== undefined) {
    const page = Number.parseInt(query.page, 10);
    if (Number.isNaN(page) || page < 1) {
      errors.push({ field: "page", message: "page must be a positive integer." });
    } else {
      pagination.page = page;
    }
  }

  if (query.limit !== undefined) {
    const limit = Number.parseInt(query.limit, 10);
    if (Number.isNaN(limit) || limit < 1 || limit > 100) {
      errors.push({ field: "limit", message: "limit must be between 1 and 100." });
    } else {
      pagination.limit = limit;
    }
  }

  return { errors, filters, pagination };
}
