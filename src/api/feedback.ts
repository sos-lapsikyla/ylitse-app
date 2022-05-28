import * as t from 'io-ts';

const langCode = t.keyof({
  fi: 0,
  en: 0,
});

const localizable = t.record(langCode, t.string);

const value = t.strict({
  value: t.number,
  labels: localizable,
});

const answerRange = t.strict({
  type: t.literal('range'),
  step: t.number,
  min: value,
  max: value,
});

const answerOptions = t.strict({
  type: t.literal('options'),
  options: t.array(value),
});

const predefinedRepetition = t.strict({
  type: t.literal('predefined'),
  times: t.number,
  days_since_previous_answer: t.number,
  messages_since_previous_answer: t.number,
});

const untilValueRepetition = t.strict({
  type: t.literal('until_value'),
  comparison: t.literal('exact'),
  value: t.number,
  days_since_previous_answer: t.number,
});

const schedule = t.strict({
  remind_times_when_skipped: t.number,
  first: t.strict({
    days_since_registration: t.number,
    sent_messages_treshold: t.number,
    repetitions: t.union([predefinedRepetition, untilValueRepetition]),
  }),
});

const questionType = t.strict({
  rules: t.strict({
    titles: localizable,
    answer: t.union([answerRange, answerOptions]),
    schedule: schedule,
  }),
});

export type Question = t.TypeOf<typeof questionType>;
