export const cls = (...c) => c.filter(Boolean).join(" ");

export function timeAgo(date) {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const sec = Math.max(1, Math.floor((now - d) / 1000));
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

  // [threshold in seconds, unit name, divisor]
  const ranges = [
    [60, "seconds", 1],
    [3600, "minutes", 60],
    [86400, "hours", 3600],
    [604800, "days", 86400],
    [2629800, "weeks", 604800],
    [31557600, "months", 2629800],
  ];

  let unit = "years";
  let value = -Math.floor(sec / 31557600);

  for (const [limit, u, divisor] of ranges) {
    if (sec < limit) {
      unit = u;
      value = -Math.floor(sec / divisor);
      break;
    }
  }

  return rtf.format(value, /** @type {Intl.RelativeTimeFormatUnit} */ (unit));
}

export const makeId = (p) => `${p}${Math.random().toString(36).slice(2, 10)}`;
