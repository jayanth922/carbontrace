// scripts/genAlgorandAccount.js
import algosdk from 'algosdk';

// generate a new account
const account = algosdk.generateAccount();
console.log('Address:', account.addr);
console.log('Mnemonic:', algosdk.secretKeyToMnemonic(account.sk));
