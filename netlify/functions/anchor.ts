// netlify/functions/anchor.ts
import type { Handler } from '@netlify/functions'
import algosdk from 'algosdk'

// pull in the Forno endpoint (no key needed)
const ALGOD_SERVER_URL = process.env.ALGOD_SERVER_URL!
// your anchor account mnemonic
const MNEMONIC         = process.env.ALGORAND_MNEMONIC!

if (!ALGOD_SERVER_URL || !MNEMONIC) {
  throw new Error('Missing ALGOD_SERVER_URL or ALGORAND_MNEMONIC')
}

// initialize client (no token header)
const algodClient = new algosdk.Algodv2('', ALGOD_SERVER_URL, '')

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Only POST allowed' }
  }

  let payload: any
  try {
    payload = JSON.parse(event.body || '{}').payload
    if (!payload) throw new Error()
  } catch {
    return { statusCode: 400, body: 'Invalid JSON or missing `payload`' }
  }

  // hash the payload
  const encoder = new TextEncoder()
  const note   = algosdk.crypto.sha256(encoder.encode(JSON.stringify(payload)))

  // derive account
  const account = algosdk.mnemonicToSecretKey(MNEMONIC)

  try {
    // build zero-ALGO self-payment with note field
    const params = await algodClient.getTransactionParams().do()
    const txn    = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from:             account.addr,
      to:               account.addr,
      amount:           0,
      note,
      suggestedParams:  params,
    })
    const signed = txn.signTxn(account.sk)
    const { txId } = await algodClient.sendRawTransaction(signed).do()
    await algosdk.waitForConfirmation(algodClient, txId, 4)

    return {
      statusCode: 200,
      body: JSON.stringify({
        txId,
        hash: Buffer.from(note).toString('hex'),
      }),
    }
  } catch (err: any) {
    console.error('Anchoring error:', err)
    return { statusCode: 502, body: err.toString() }
  }
}
