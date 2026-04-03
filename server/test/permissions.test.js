import assert from "node:assert/strict";
import test from "node:test";
import { PERMISSIONS, ROLES } from "../src/utils/constants.js";
import { hasPermission } from "../src/utils/permissions.js";

test("viewer can only access dashboard summaries", () => {
  assert.equal(hasPermission(ROLES.VIEWER, PERMISSIONS.DASHBOARD_VIEW), true);
  assert.equal(hasPermission(ROLES.VIEWER, PERMISSIONS.RECORDS_VIEW), false);
  assert.equal(hasPermission(ROLES.VIEWER, PERMISSIONS.RECORDS_WRITE), false);
  assert.equal(hasPermission(ROLES.VIEWER, PERMISSIONS.USERS_MANAGE), false);
});

test("analyst can read records and dashboard but cannot manage data", () => {
  assert.equal(hasPermission(ROLES.ANALYST, PERMISSIONS.DASHBOARD_VIEW), true);
  assert.equal(hasPermission(ROLES.ANALYST, PERMISSIONS.RECORDS_VIEW), true);
  assert.equal(hasPermission(ROLES.ANALYST, PERMISSIONS.RECORDS_WRITE), false);
  assert.equal(hasPermission(ROLES.ANALYST, PERMISSIONS.USERS_MANAGE), false);
});

test("admin can perform all supported actions", () => {
  assert.equal(hasPermission(ROLES.ADMIN, PERMISSIONS.DASHBOARD_VIEW), true);
  assert.equal(hasPermission(ROLES.ADMIN, PERMISSIONS.RECORDS_VIEW), true);
  assert.equal(hasPermission(ROLES.ADMIN, PERMISSIONS.RECORDS_WRITE), true);
  assert.equal(hasPermission(ROLES.ADMIN, PERMISSIONS.USERS_MANAGE), true);
});

