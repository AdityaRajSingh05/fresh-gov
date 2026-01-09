// mockdata.js

export const datasets = [
  {
    id: '1',
    name: 'external_leads_feed',
    domain: 'Sales',
    classification: 'Sensitive',
    sourceType: 'CSV',
  },
  {
    id: '2',
    name: 'central_customer_360',
    domain: 'Finance',
    classification: 'Confidential',
    sourceType: 'JSON',
  },
  {
    id: '3',
    name: 'mkt_segment_export',
    domain: 'Finance',
    classification: 'Internal',
    sourceType: 'XML',
  },
  {
    id: '4',
    name: 'promo_reward_catalog',
    domain: 'Operations',
    classification: 'Confidential',
    sourceType: 'JSON',
  },
];

export const metrics = {
  totalDatasets: 5,
  activeRules: 3,
  lineageMapping: 4,
};

// module.exports = {
//   datasets,
//   metrics,
// };
