export type Grade = "again" | "hard" | "good" | "easy";

export interface SchedulableCard {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
}

export interface ScheduleResult {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  dueAt: Date;
}

const QUALITY: Record<Grade, number> = {
  again: 1,
  hard: 3,
  good: 4,
  easy: 5,
};

const AGAIN_INTERVAL_DAYS = 10 / (24 * 60); // 10 minutes, expressed in days

/**
 * SM-2 spaced-repetition scheduler. `again` resets the card into a short
 * same-day queue instead of the textbook "1 day" reset, which is the
 * convention most modern SRS apps (Anki included) use for failed cards.
 */
export function schedule(card: SchedulableCard, grade: Grade, now: Date = new Date()): ScheduleResult {
  const quality = QUALITY[grade];

  if (quality < 3) {
    return {
      easeFactor: Math.max(1.3, card.easeFactor - 0.2),
      intervalDays: AGAIN_INTERVAL_DAYS,
      repetitions: 0,
      dueAt: addDays(now, AGAIN_INTERVAL_DAYS),
    };
  }

  const nextEase = Math.max(
    1.3,
    card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  let nextInterval: number;
  const nextRepetitions = card.repetitions + 1;
  if (card.repetitions === 0) {
    nextInterval = 1;
  } else if (card.repetitions === 1) {
    nextInterval = 6;
  } else {
    nextInterval = Math.round(card.intervalDays * nextEase);
  }

  // Easy gives a small bonus bump over Good's base interval.
  if (grade === "easy") {
    nextInterval = Math.round(nextInterval * 1.3);
  }

  return {
    easeFactor: nextEase,
    intervalDays: nextInterval,
    repetitions: nextRepetitions,
    dueAt: addDays(now, nextInterval),
  };
}

export function previewIntervals(card: SchedulableCard): Record<Grade, string> {
  return {
    again: humanizeDays(AGAIN_INTERVAL_DAYS),
    hard: humanizeDays(schedule(card, "hard").intervalDays),
    good: humanizeDays(schedule(card, "good").intervalDays),
    easy: humanizeDays(schedule(card, "easy").intervalDays),
  };
}

export function humanizeDays(days: number): string {
  if (days < 1) {
    const minutes = Math.round(days * 24 * 60);
    return `${minutes}m`;
  }
  if (days < 30) return `${Math.round(days)}d`;
  if (days < 365) return `${Math.round(days / 30)}mo`;
  return `${Math.round(days / 365)}y`;
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}
