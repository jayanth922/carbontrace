// scripts/getAlgorandAddress.js
import algosdk from 'algosdk'

// paste your 25-word mnemonic here:
const MNEMONIC = 'odor arrange glimpse wage empty dizzy street dove arrow afraid next art limit amount easily boy expose siege kingdom split clutch denial now about license'

// derive the account
const account = algosdk.mnemonicToSecretKey(MNEMONIC)

console.log('Address:', account.addr)
