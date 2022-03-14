import {
  getProgram, getProvider,
} from '@helpers/mixins';
import {
  Keypair,
  PublicKey,
} from '@solana/web3.js';
import {
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { VITALUS_TOKEN_MINT } from '@helpers/constants';
import { getMintGovPDA } from '@helpers/pdas';
import { 
  REALM_NAME,
  GOVERNANCE_PROGRAM_ADDRESS, 
} from '@helpers/constants';
import BN from 'bn.js';
import { getProgramGovPDA, getRealmPDA } from '@helpers/pdas';

export const MintCommunityTokenThroughRealm = async (
  user: Keypair,
  amount: number | BN,
  mint?: PublicKey
) => {
  mint = mint ? mint : VITALUS_TOKEN_MINT;
  const userTokAcount = await getOrCreateAssociatedTokenAccount(
    getProvider().connection,
    user, mint,
    user.publicKey,
  );

  const program = getProgram();
  const { mintGovernance, bump } = await getMintGovPDA(mint);
  const realm = await getRealmPDA();
  const programGovernance = await getProgramGovPDA();

  const ix = program.instruction.mintCommunityTokenThroughRealm(
    bump,
    REALM_NAME,
    new BN(amount),
    {
      accounts: {
        tokenMint: mint,
        userTokenAccount: userTokAcount.address,
        mintGovernance: mintGovernance,
        realm: realm,
        governacneProgram: GOVERNANCE_PROGRAM_ADDRESS,
        programGovernance: programGovernance,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
      signers: [],
    }
  );

  return ix;
}