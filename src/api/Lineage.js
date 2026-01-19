
// lineage.js
import { Client } from './Client';

/**
 * Fetch lineage for a dataset.
 * Server endpoint (from your code): GET /api/v1/lineage?dataset_id=<id>
 *
 * @param {number|string} datasetId
 * @returns {Promise<{nodes: Array, edges: Array, upstream?: Array, downstream?: Array}>}
 */
export async function getLineage(datasetId) {
  if (!datasetId && datasetId !== 0) {
    throw new Error('datasetId is required for getLineage');
  }

  const client = Client();
  try {
    const res = await client.get('/lineage', {
      params: { dataset_id: datasetId },
    });

    const api = res.data || {};

    // --- Normalize duplicates (your sample shows repeated up-5 node/edge) ---
    const nodeMap = new Map();
    (api.nodes ?? []).forEach((n) => {
      if (!nodeMap.has(n.id)) nodeMap.set(n.id, n);
    });

    // Deduplicate edges by source-target pair
    const edgeKey = (e) => `${e.source}::${e.target}`;
    const edgeMap = new Map();
    (api.edges ?? []).forEach((e) => {
      const key = edgeKey(e);
      if (!edgeMap.has(key)) edgeMap.set(key, e);
    });

    return {
      upstream: api.upstream ?? [],
      downstream: api.downstream ?? [],
      nodes: Array.from(nodeMap.values()),
      edges: Array.from(edgeMap.values()),
    };
  } catch (error) {
    console.error('Error fetching lineage data:', error);
    throw error;
  }
}


export function getDataset() {
    const client = Client();
    return client.get('/datasets')
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching datasets:', error);
            throw error;
        });
}
