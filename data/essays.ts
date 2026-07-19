export interface Essay {
  slug: string;
  title: string;
  dek: string;
  date: string; // ISO
  readingMinutes: number;
  /** Plain paragraphs, rendered in order. No markdown pipeline needed. */
  body: string[];
}

export const essays: Essay[] = [
  {
    slug: 'the-90-second-reset',
    title: 'The 90-second reset before a hard conversation',
    dek: 'You rarely get an hour to prepare for the moment that decides the quarter. You almost always get ninety seconds.',
    date: '2026-07-15',
    readingMinutes: 3,
    body: [
      "The layoff, the board update that's going to disappoint, the co-founder conversation you've rehearsed and dreaded — these moments don't come with a meditation cushion and a free morning. They come between two other meetings, while your body is already carrying the last one.",
      "So the practice that matters isn't the forty-minute morning sit, valuable as that is. It's what you can do in the ninety seconds before you walk into the room. Here is the whole thing.",
      "First, notice you're activated. That's it — just notice. The tight jaw, the shallow breath high in the chest, the mind already three sentences into the argument. Naming it silently — 'activated' — is not a technique to feel better. It's the moment the observer comes back online, and the observer is the part of you that makes good decisions.",
      "Second, lengthen the exhale. Not a big cleansing breath — those keep you keyed up. A normal breath in, then let the out-breath run longer than the in-breath, two or three times. The long exhale is the one lever you have on the nervous system that works in seconds, not minutes. It tells the body the emergency is over, even when the meeting hasn't started.",
      "Third, pick one thing you actually want from the conversation, and hold it. Not your case — your aim. 'I want them to leave with their dignity.' 'I want the truth on the table.' 'I want us to still be able to work together tomorrow.' The aim is what keeps you from getting hijacked by the first provocation.",
      "That's the reset: notice, exhale, aim. Ninety seconds. It won't make the conversation easy. It will make you the calmest, clearest person in the room — which, when you're the one who has to lead it, is most of the job.",
      "The reason it works under pressure is that you practiced the components when there was no pressure. That's what the morning sit is actually for. You're not sitting to feel peaceful. You're training the exact muscle you'll reach for at 2:55, thirty seconds before the door opens.",
    ],
  },
];

export function getEssay(slug: string): Essay | undefined {
  return essays.find((e) => e.slug === slug);
}
