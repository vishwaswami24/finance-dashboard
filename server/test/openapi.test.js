import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const openApiPath = path.resolve(currentDir, "../openapi.yaml");

test("openapi spec documents the core finance dashboard routes", () => {
  const content = readFileSync(openApiPath, "utf8");

  assert.match(content, /^openapi: 3\.0\.3/m);
  assert.match(content, /\/api\/auth\/login:/);
  assert.match(content, /\/api\/users:/);
  assert.match(content, /\/api\/records:/);
  assert.match(content, /\/api\/dashboard:/);
});
