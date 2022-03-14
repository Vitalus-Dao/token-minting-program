import { PublicKey } from "@solana/web3.js";
import { 
  GOVERNANCE_PROGRAM_ADDRESS, 
  PROGRAM_ADDRESS, 
  REALM_NAME
} from "@helpers/constants";
import { TOKEN_METADATA_PROGRAM_ADDRESS } from '@helpers/constants';

export const getMintGovPDA = async (
  mint: PublicKey,
) => {
  const [mintGovernance, govNonce] = await PublicKey.findProgramAddress(
    [
      Buffer.from("mint-gov"),
      mint.toBuffer(),
    ],
    PROGRAM_ADDRESS,
  );

  return { 
    mintGovernance, 
    bump: govNonce,
  };
}

export const getMetadataAccountPDA = async (
  mint: PublicKey,
) => {
  const [metadataAccount, bump] = await PublicKey.findProgramAddress(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ADDRESS.toBuffer(),
      mint.toBuffer()
    ],
    TOKEN_METADATA_PROGRAM_ADDRESS,
  );

  return { 
    metadataAccount, 
    bump,
  };
}

export const getSingleUsePDA = async (
  mint: PublicKey,
  nftMint: PublicKey,
) => {
  const [singleUseAccount, bump] = await PublicKey.findProgramAddress(
    [
      Buffer.from("single use"),
      mint.toBuffer(),
      nftMint.toBuffer()
    ],
    PROGRAM_ADDRESS,
  );

  return { 
    singleUseAccount, 
    bump,
  };
}

export const getRealmPDA = async () => {
  const [realm] = await PublicKey.findProgramAddress(
    [
      Buffer.from("governance"),
      Buffer.from(REALM_NAME),
    ],
    GOVERNANCE_PROGRAM_ADDRESS,
  );

  return realm;
}

export const getProgramGovPDA =  async () => {
  const [programGovernance] = await PublicKey.findProgramAddress(
    [
      Buffer.from("program-governance"),
      (await getRealmPDA()).toBuffer(),
      PROGRAM_ADDRESS.toBuffer(),
    ],
    GOVERNANCE_PROGRAM_ADDRESS,
  );

  return programGovernance;
}