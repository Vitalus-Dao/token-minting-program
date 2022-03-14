import * as anchor from '@project-serum/anchor';
import fs from 'fs';
import { 
  Provider, 
  Program, 
  Idl,
} from '@project-serum/anchor';
import { Connection, Keypair } from '@solana/web3.js';
import idl from '../../../target/idl/vita_token.json';
import { DEVNET_RPC_ENDPOINT, PROGRAM_ADDRESS } from './constants';
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet';

export const getProvider = () => {
  const opts = Provider.defaultOptions();
  const connection = new Connection(
    DEVNET_RPC_ENDPOINT,
    opts.commitment
  );
  const wallet = new NodeWallet(
    getLocalKeyypair(process.env.SOLANA_WALLET_FILEPATH)
  );
  const provider = new Provider(connection, wallet, opts);
  anchor.setProvider(provider);

  return provider;
}

export const getProgram = () => {
  const program = new Program(
    idl as Idl, 
    PROGRAM_ADDRESS, 
    getProvider(),
  );

  return program;
}

export const getLocalKeyypair = (filePath: string) => {
  const key: [number] = JSON.parse(fs.readFileSync(filePath).toString());
  const kp = Keypair.fromSecretKey(Uint8Array.from(key));
  
  return kp;
}