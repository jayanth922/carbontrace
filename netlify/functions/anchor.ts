// netlify/functions/anchor.ts
import type { Handler } from '@netlify/functions';
import algosdk from 'algosdk';
import crypto from 'crypto';

// pull in the Forno endpoint (no key needed)
const ALGOD_SERVER_URL = process.env.ALGOD_SERVER_URL;
const MNEMONIC = process.env.ALGORAND_MNEMONIC;

if (!ALGOD_SERVER_URL || !MNEMONIC) {
  console.error('Missing ALGOD_SERVER_URL or ALGORAND_MNEMONIC');
  throw new Error('Environment variables ALGOD_SERVER_URL and ALGORAND_MNEMONIC must be set');
}

// initialize client (no token header)
const algodClient = new algosdk.Algodv2('', ALGOD_SERVER_URL, '');

interface Payload {
  payloadData: string;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Only POST allowed' };
  }

  let payload: Payload;
  try {
    payload = JSON.parse(event.body || '{}').payload;
    if (!payload || !payload.payloadData) throw new Error('Missing `payloadData`');
  } catch (err) {
    console.error('Invalid JSON or missing `payloadData`:', err);
    return { statusCode: 400, body: 'Invalid JSON or missing `payloadData`' };
  }

  try {
    // hash the payload using Node.js crypto
    const note = crypto.createHash('sha256').update(payload.payloadData).digest();

    // derive account
    const account = algosdk.mnemonicToSecretKey(MNEMONIC);

    // build zero-ALGO self-payment with note field
    const params = await algodClient.getTransactionParams().do();
    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      sender: account.addr,
      receiver: account.addr,
      amount: 0,
      note,
      suggestedParams: params,
    });
    const signed = txn.signTxn(account.sk);
    const response = await algodClient.sendRawTransaction(signed).do();
    const txId = response.txid; // Corrected property name
    await algosdk.waitForConfirmation(algodClient, txId, 4);

    return {
      statusCode: 200,
      body: JSON.stringify({
        txId,
        hash: note.toString('hex'),
      }),
    };
  } catch (err: unknown) {
    console.error('Anchoring error:', err);
    return { statusCode: 502, body: 'Error processing transaction: ' + (err as Error).message };
  }
};
