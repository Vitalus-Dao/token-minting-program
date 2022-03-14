import {
  getProgram,
} from '@helpers/mixins';
import {
  Keypair,
  PublicKey,
  SystemProgram
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { VITALUS_TOKEN_MINT } from '@helpers/constants';
import { getMintGovPDA } from '@helpers/pdas';

export const CreateMintGovernance = async (
  user: Keypair,
  prevAuth: Keypair,
  mint?: PublicKey
) => {
  mint = mint ? mint : VITALUS_TOKEN_MINT;

  const program = getProgram();
  const { mintGovernance } = await getMintGovPDA(mint);

  const ix = program.instruction.createMintGovernance(
    {
      accounts: {
        payer: user.publicKey,
        mint: mint,
        prevMintAuthority: prevAuth.publicKey,
        mintGovernance: mintGovernance,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      },
      signers: [user, prevAuth],
    }
  );

  return ix;
}