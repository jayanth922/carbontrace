// netlify/functions/anchor.ts
import type { Handler } from '@netlify/functions'
import algosdk from 'algosdk'

const ALGOD_TOKEN    = process.env.PURESTAKE_API_KEY!
const ALGOD_SERVER   = process.env.ALGOD_SERVER_URL!   // e.g. "https://testnet-algorand.api.purestake.io/ps2"
const ALGOD_PORT     = ''                               // PureStake uses empty port
const MNEMONIC       = process.env.ALGORAND_MNEMONIC!   // 25-word mnemonic for your anchor account

if (!ALGOD_TOKEN || !ALGOD_SERVER || !MNEMONIC) {
  throw new Error('Missing Algorand environment variables (PURESTAKE_API_KEY, ALGOD_SERVER_URL, ALGORAND_MNEMONIC).')
}

// initialize algod client
const algodClient = new algosdk.Algodv2(
  { 'X-API-Key': ALGOD_TOKEN },
  ALGOD_SERVER,
  ALGOD_PORT
)

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Only POST allowed' }
  }

  // parse the activity payload we want to anchor
  let payload: any
  try {
    payload = JSON.parse(event.body || '{}').payload
  } catch {
    return { statusCode: 400, body: 'Invalid JSON payload' }
  }
  if (!payload) {
    return { statusCode: 400, body: 'Missing `payload` field' }
  }

  // compute a SHA-256 hash of the payload
  const encoder = new TextEncoder()
  const noteBytes = algosdk.crypto.sha256(encoder.encode(JSON.stringify(payload)))

  // derive account from mnemonic
  const account = algosdk.mnemonicToSecretKey(MNEMONIC)

  try {
    // prepare transaction: zero-microalgo payment to self with our hash in `note`
    const params = await algodClient.getTransactionParams().do()
    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: account.addr,
      to:   account.addr,
      amount: 0,
      note: noteBytes,
      suggestedParams: params
    })
    const signed = txn.signTxn(account.sk)
    const { txId } = await algodClient.sendRawTransaction(signed).do()
    // wait for confirmation
    await algosdk.waitForConfirmation(algodClient, txId, 4)

    return {
      statusCode: 200,
      body: JSON.stringify({
        txId,
        hash: Buffer.from(noteBytes).toString('hex'),
      }),
    }
  } catch (err: any) {
    console.error('Algorand anchor error:', err)
    return { statusCode: 502, body: err.toString() }
  }
}
