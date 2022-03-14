import {
  getProgram,
} from '@helpers/mixins';
import {
  Keypair,
  PublicKey,
  SystemProgram
} from '@solana/web3.js';
import {
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { VITALUS_TOKEN_MINT } from '@helpers/constants';
import { getMintGovPDA } from '@helpers/pdas';
import { getMetadataAccountPDA, getSingleUsePDA } from '@helpers/pdas';
import { getProvider } from '@project-serum/anchor';

export const MintCommunityTokenToNftHolder = async (
  user: Keypair,
  nftMint: PublicKey,
  nftTokAcnt: PublicKey,
  mint?: PublicKey,
) => {
  mint = mint ? mint : VITALUS_TOKEN_MINT;
  const userTokAcount = await getOrCreateAssociatedTokenAccount(
    getProvider().connection,
    user, mint,
    user.publicKey,
  );

  const program = getProgram();
  // const nftMint = new PublicKey("GeH5xsQsjNW3ZUecuzdUQc63wMMjnTuECpWbwD3Lwgzu");
  // const nftTokAcnt = new PublicKey("Ex9v89Q4uYTazShAf3RMPVy5x8p8W5jHXne9KsrhnL7C");
  // const nftMetadataAccount = await Metadata.getPDA(nftMint);
  const { metadataAccount }  = await getMetadataAccountPDA(nftMint);
  const { singleUseAccount } = await getSingleUsePDA(mint, nftMint);
  const { mintGovernance, bump } = await getMintGovPDA(mint);


  const ix = program.instruction.mintCommunityTokenToNftHolder(
    bump,
    {
      accounts: {
        payer: user.publicKey,
        tokenMint: mint,
        userTokenAccount: userTokAcount.address,
        user: user.publicKey,
        mintGovernance: mintGovernance,
        nftMint: nftMint,
        nftTokenAccount: nftTokAcnt,
        nftMetadataAccount: metadataAccount,
        once: singleUseAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      },
      signers: [user],
    }
  );

  return ix;
}