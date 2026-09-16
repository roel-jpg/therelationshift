// Shapes of the `data` column per exercise type (as imported from the original program).

export type BasicMultipleData = {
  questions: { question: string; description?: string; type?: string; order?: number }[];
  outro?: string;
};

export type LoveLanguageData = {
  data: { options: { text: string; value: string }[] }[];
};

export type ChecklistData = { text: string; order?: number }[];

export type TrueFalseData = {
  content: { group: string; subtitle?: string; list: { text: string; order?: number }[]; order?: number }[];
};

export type ListOrderData = { title: string; value: string }[];

export const LOVE_LANGUAGES: Record<string, string> = {
  A: 'Words of Affirmation',
  B: 'Quality Time',
  C: 'Receiving Gifts',
  D: 'Acts of Service',
  E: 'Physical Touch',
};

export type ExerciseProps = {
  data: unknown;
  initial: unknown; // previously saved answer (or null)
  onChange: (answer: unknown) => void;
};
