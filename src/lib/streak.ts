function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isYesterday(a: Date, b: Date) {
  const yesterday = new Date(b);
  yesterday.setDate(b.getDate() - 1);
  return isSameDay(a, yesterday);
}

export function nextStreak(lastStudyAt: Date | null, currentStreak: number, now: Date = new Date()) {
  if (!lastStudyAt) return 1;
  if (isSameDay(lastStudyAt, now)) return currentStreak;
  if (isYesterday(lastStudyAt, now)) return currentStreak + 1;
  return 1;
}
