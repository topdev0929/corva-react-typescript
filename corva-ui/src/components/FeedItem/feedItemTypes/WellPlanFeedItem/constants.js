export const SUBSCRIPTIONS = [
    {
      provider: 'corva',
      collection: 'data.actual_survey',
      event: 'update',
      meta: { subscribeToLatestOnly: true },
      params: {
        limit: 1,
        sort: '{ timestamp: -1 }',
      },
    },
    {
      provider: 'corva',
      collection: 'data.plan_survey',
      meta: { subscribeToLatestOnly: true },
      params: {
        limit: 1,
        sort: '{ timestamp: -1 }',
      },
    },
    {
      provider: 'corva',
      collection: 'wits',
    },
  ];