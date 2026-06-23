const oneDayMs = 24 * 60 * 60 * 1000;

export type DailyCacheEnvelope<TRaw, TNormalized> = {
  cacheDate: string;
  sourceId: string;
  raw: TRaw;
  normalized: TNormalized;
  lastUpdated: string;
  expiresAt: string;
};

export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function toDisplayDate(value: string | null | undefined) {
  return value ? value.slice(0, 10) : "N/A";
}

export function latestIsoDate(values: Array<string | null | undefined>) {
  const sorted = values
    .filter((value): value is string => Boolean(value))
    .sort((left, right) => Date.parse(right) - Date.parse(left));

  return sorted[0] ?? null;
}

export function shouldRefreshDaily(generatedAt: string | null | undefined, force = false, now = new Date()) {
  if (force) return true;
  if (!generatedAt) return true;
  return now.getTime() - Date.parse(generatedAt) >= oneDayMs;
}

export function createDailyEnvelope<TRaw, TNormalized>({
  sourceId,
  raw,
  normalized,
  now = new Date()
}: {
  sourceId: string;
  raw: TRaw;
  normalized: TNormalized;
  now?: Date;
}): DailyCacheEnvelope<TRaw, TNormalized> {
  return {
    cacheDate: todayKey(now),
    sourceId,
    raw,
    normalized,
    lastUpdated: now.toISOString(),
    expiresAt: new Date(now.getTime() + oneDayMs).toISOString()
  };
}
