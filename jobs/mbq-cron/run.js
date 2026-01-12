#!/usr/bin/env node

/**
 * MBQ Cron Job Runner
 * Triggers auto-moment and recap evaluators on a schedule
 * 
 * Environment Variables:
 *   QRDB_URL - Base URL of the Strapi backend (e.g., https://qrdb-production.up.railway.app)
 *   MBQ_CRON_KEY - Secret key for authenticating with evaluator endpoints
 *   TIMEOUT_MS - Optional, request timeout in milliseconds (default: 15000)
 */

const TIMEOUT_MS = parseInt(process.env.TIMEOUT_MS || '15000', 10);

/**
 * Make a POST request with timeout
 */
async function postWithTimeout(url, headers, body, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs}ms`);
    }
    throw err;
  }
}

/**
 * Call an evaluator endpoint
 */
async function callEvaluator(name, url, cronKey) {
  console.log(`[${name}] Calling ${url}...`);
  
  const headers = {
    'Content-Type': 'application/json',
    'x-mbq-cron-key': cronKey,
  };

  const body = { dryRun: false };

  try {
    const response = await postWithTimeout(url, headers, body, TIMEOUT_MS);
    const data = await response.json();

    if (!response.ok) {
      console.error(`[${name}] HTTP ${response.status}: ${JSON.stringify(data)}`);
      return { ok: false, status: response.status, data };
    }

    console.log(`[${name}] Response:`, JSON.stringify(data, null, 2));
    return { ok: data.ok === true, status: response.status, data };
  } catch (err) {
    console.error(`[${name}] Error: ${err.message}`);
    return { ok: false, error: err.message };
  }
}

/**
 * Main entry point
 */
async function main() {
  console.log('='.repeat(60));
  console.log(`MBQ Cron Runner - ${new Date().toISOString()}`);
  console.log('='.repeat(60));

  // Validate environment
  const qrdbUrl = process.env.QRDB_URL;
  const cronKey = process.env.MBQ_CRON_KEY;

  if (!qrdbUrl) {
    console.error('ERROR: QRDB_URL environment variable is required');
    process.exit(1);
  }

  if (!cronKey) {
    console.error('ERROR: MBQ_CRON_KEY environment variable is required');
    process.exit(1);
  }

  console.log(`QRDB_URL: ${qrdbUrl}`);
  console.log(`TIMEOUT_MS: ${TIMEOUT_MS}`);
  console.log('');

  // Call evaluators sequentially
  const results = [];

  // 1. Evaluate auto-moments
  const autoResult = await callEvaluator(
    'evaluate-auto',
    `${qrdbUrl}/api/fan-moments/evaluate-auto`,
    cronKey
  );
  results.push({ name: 'evaluate-auto', ...autoResult });

  console.log('');

  // 2. Evaluate recaps
  const recapResult = await callEvaluator(
    'evaluate-recap',
    `${qrdbUrl}/api/fan-moments/evaluate-recap`,
    cronKey
  );
  results.push({ name: 'evaluate-recap', ...recapResult });

  console.log('');
  console.log('='.repeat(60));
  console.log('Summary:');
  
  let allOk = true;
  for (const r of results) {
    const status = r.ok ? '✓ OK' : '✗ FAILED';
    console.log(`  ${r.name}: ${status}`);
    if (!r.ok) allOk = false;
  }

  console.log('='.repeat(60));

  if (!allOk) {
    console.error('One or more evaluators failed');
    process.exit(1);
  }

  console.log('All evaluators completed successfully');
  process.exit(0);
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
