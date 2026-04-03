import assert from "node:assert/strict";
import test from "node:test";
import {
  validateLoginPayload,
  validateRecordFilters,
  validateRecordPayload,
  validateUserPayload
} from "../src/utils/validation.js";

test("user validation accepts a valid admin payload", () => {
  const { errors, value } = validateUserPayload({
    name: "Finance Admin",
    email: "admin@example.com",
    password: "Password@123",
    role: "admin",
    status: "active"
  });

  assert.equal(errors.length, 0);
  assert.equal(value.email, "admin@example.com");
});

test("login validation rejects an invalid email", () => {
  const { errors } = validateLoginPayload({
    email: "not-an-email",
    password: "whatever"
  });

  assert.equal(errors.length, 1);
  assert.equal(errors[0].field, "email");
});

test("record validation rejects non-positive amounts", () => {
  const { errors } = validateRecordPayload({
    amount: 0,
    type: "expense",
    category: "Operations",
    occurredAt: "2026-04-01"
  });

  assert.equal(errors.length, 1);
  assert.equal(errors[0].field, "amount");
});

test("record filters reject invalid date ranges", () => {
  const { errors } = validateRecordFilters({
    startDate: "2026-05-01",
    endDate: "2026-04-01"
  });

  assert.equal(errors.length, 1);
  assert.equal(errors[0].field, "dateRange");
});
