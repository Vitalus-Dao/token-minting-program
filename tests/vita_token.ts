import * as anchor from "@project-serum/anchor";
import { Program, BN } from "@project-serum/anchor";
import { VitaToken } from "../target/types/vita_token";
import { 
  getOrCreateAssociatedTokenAccount,
  createMint,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import { 
  Keypair, 
  LAMPORTS_PER_SOL, 
  PublicKey, 
  SystemProgram, 
  Transaction
} from '@solana/web3.js';
import fs from 'fs';
import { serializeInstructionToBase64 } from '@solana/spl-governance';

const TOKEN_METADATA_PROGRAM = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

describe("vita_token", () => {
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);
  const { publicKey } = provider.wallet;

  const program = anchor.workspace.VitaToken as Program<VitaToken>;

  it("Inits", async () => {
    
  });
});

