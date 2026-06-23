const moneyFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1
});

export function formatMoney(value: number) {
  return `$${moneyFormatter.format(value * 1_000_000)}`;
}

export function formatPercent(value: number | null) {
  return value === null ? "N/A" : `${numberFormatter.format(value)}%`;
}

export function formatMultiple(value: number | null) {
  return value === null ? "N/A" : `${numberFormatter.format(value)}x`;
}

export function formatNumber(value: number | null) {
  return value === null ? "N/A" : numberFormatter.format(value);
}
