export const roleDescriptions = {
  viewer: "Can access dashboard summaries and recent activity only.",
  analyst: "Can inspect records, trends, and dashboard insights.",
  admin: "Can manage users, create records, and maintain the full system."
};

export const defaultAuthForm = {
  email: "admin@financehub.local",
  password: "Admin@123"
};

export const defaultFilters = {
  type: "",
  category: "",
  startDate: "",
  endDate: "",
  search: ""
};

export const recordCategories = [
  "Operations",
  "Revenue",
  "Payroll",
  "Marketing",
  "Compliance",
  "Software",
  "Taxes",
  "Travel",
  "Utilities",
  "Investments",
  "Other"
];

export function getCategoryOptions(selectedValue = "") {
  if (selectedValue && !recordCategories.includes(selectedValue)) {
    return [selectedValue, ...recordCategories];
  }

  return recordCategories;
}

export function createEmptyRecordForm() {
  return {
    amount: "",
    type: "expense",
    category: "Operations",
    occurredAt: new Date().toISOString().slice(0, 10),
    notes: ""
  };
}

export function createEmptyUserForm() {
  return {
    name: "",
    email: "",
    password: "",
    role: "viewer",
    status: "active"
  };
}

export function buildQuery(params) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });

  return query.toString();
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(Number(value ?? 0));
}

export function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

export function toInputDate(value) {
  return value ? new Date(value).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
}

export function getErrorMessage(error) {
  const details = Array.isArray(error.details)
    ? error.details.map((item) => item.message).join(" ")
    : "";

  return details ? `${error.message} ${details}` : error.message;
}
