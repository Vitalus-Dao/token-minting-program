import {
  getProgram,
  getProvider,
} from '@helpers/mixins';
import { TOKEN_METADATA_PROGRAM_ADDRESS } from '@helpers/constants';
import { getMetadataAccountPDA } from '@helpers/pdas';
import {
  Keypair,
  SystemProgram,
  SYSVAR_RENT_PUBKEY
} from '@solana/web3.js';
import {
  createMint,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import BN from 'bn.js';

export const CreateTokenWithMetadata = async (
  user: Keypair,
  auth: Keypair,
  name: string,
  symbol: string,
  uri?: string,
  decimals?: number,
  mintKeypair?: Keypair,
) => {
  const program = getProgram();

  const mint = await createMint(
    getProvider().connection, 
    user,
    auth.publicKey,
    null, 
    !isNaN(decimals) ? decimals : 0,
    mintKeypair ? mintKeypair : undefined,
  );

  const { metadataAccount } = await getMetadataAccountPDA(mint);

  const ix = program.instruction.createTokenWithMetadata(
    name,
    symbol,
    uri ? uri : "",
    new BN(0),
    false,
    false,
    {
      accounts: {
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ADDRESS,
        metadata: metadataAccount,
        mint,
        mintAuthority: user.publicKey,
        payer: user.publicKey,
        updateAuthority: auth.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
      },
      signers: [user, auth]
    },
  );

  return ix;
}