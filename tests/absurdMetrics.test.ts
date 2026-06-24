import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  calculateAbsurdMetrics,
  calculateCeoSleep,
  calculateDoubleWithoutNews,
  calculateHypeLiability,
  calculateThingsMustGoRight
} from "../lib/absurdMetrics.ts";
import type { Company } from "../types/company.ts";

const companies = JSON.parse(
  readFileSync(new URL("../data/companies.json", import.meta.url), "utf8")
) as Company[];

const panAmerican = companies.find((company) => company.slug === "pan-american-silver")!;
const nexGen = companies.find((company) => company.slug === "nexgen-energy")!;
const noManualInputs = companies.find((company) => !company.absurdMetrics)!;

test("calculates every enabled metric without crashing", () => {
  const results = calculateAbsurdMetrics(panAmerican);

  assert.equal(results.length, 10);
  assert.equal(new Set(results.map((result) => result.id)).size, 10);
  assert.ok(results.every((result) => result.score === null || (result.score >= 0 && result.score <= 100)));
});

test("missing manual data produces transparent low-confidence output", () => {
  const result = calculateHypeLiability(noManualInputs);

  assert.equal(result.score, null);
  assert.equal(result.label, "No text sample");
  assert.equal(result.confidence, "low");
  assert.ok(result.missingInputs.includes("hypeKeywordCount"));
});

test("lower miracle count is treated as better", () => {
  const result = calculateThingsMustGoRight(panAmerican);

  assert.equal(result.isHigherBetter, false);
  assert.equal(result.label, "Simple");
  assert.ok((result.score ?? 100) < 50);
});

test("developer cash burn produces a finite funding-runway score", () => {
  const result = calculateCeoSleep(nexGen);

  assert.notEqual(result.score, null);
  assert.equal(result.inputsUsed.quarterlyCashBurn, 18);
  assert.match(result.explanation, /months/);
});

test("valuation test reports missing checks instead of inventing them", () => {
  const result = calculateDoubleWithoutNews(nexGen);

  assert.ok(result.missingInputs.includes("evEbitda"));
  assert.ok(result.missingInputs.includes("pNav"));
  assert.notEqual(result.confidence, "high");
});
