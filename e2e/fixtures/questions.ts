export const questions = [
  {
    rules: {
      recipients: ['mentee'],
      titles: {
        fi: 'Kun ajattelet nykyhetkeä, kuinka tyytyväinen olet luottamuksellisiin ihmissuhteisiisi?',
        en: 'When you think about the present, how satisfied are you with your confidential relationships?',
      },
      answer: {
        type: 'range',
        step: 1,
        min: {
          value: 0,
          labels: {
            fi: 'Erittäin tyytymätön',
            en: 'Very dissatisfied',
          },
        },
        max: {
          value: 100,
          labels: {
            fi: 'Erittäin tyytyväinen',
            en: 'Very pleased',
          },
        },
      },
      schedule: {
        remind_times_when_skipped: 3,
        remind_interval_days: 1,
        first: {
          days_since_registration: 0,
          sent_messages_threshold: 0,
          max_old_account_in_days: 30,
        },
        repetitions: {
          type: 'predefined',
          times: 2,
          days_since_previous_answer: 30,
          messages_since_previous_answer: 100,
          min_days_since_previous_answer: 14,
        },
      },
    },
  },
  {
    rules: {
      recipients: ['mentee'],
      titles: {
        fi: 'Oletko saanut apua mentorilta?',
        en: 'Have you received help from a mentor?',
      },
      answer: {
        type: 'yes-no',
        yes: {
          value: 1,
          labels: { fi: 'Kyllä olen', en: 'Yes, I have' },
        },
        no: {
          value: 0,
          labels: { fi: 'En ole', en: "No, I haven't" },
        },
      },
      schedule: {
        remind_times_when_skipped: 0,
        remind_interval_days: 1,
        first: {
          days_since_registration: 0,
          sent_messages_threshold: 0,
          max_old_account_in_days: 30,
        },
        repetitions: {
          type: 'until_value',
          comparison: 'exact',
          value: 1,
          days_since_previous_answer: 7,
        },
      },
    },
  },
] as const;
