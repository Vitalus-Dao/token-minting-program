use {
  anchor_lang::prelude::*,
  crate::context::*,
  mpl_token_metadata::{
    state::{
      Metadata
    },
    instruction::{ 
      create_metadata_accounts_v2, 
    },
  },
  solana_program::{
    program::{
      invoke,
      invoke_signed,
    },
    entrypoint::ProgramResult,
  },
  spl_token::instruction::{
    set_authority,
    mint_to,
    AuthorityType,
  },
};


pub fn process_create_token_with_metadata(
  ctx: Context<CreateTokenWithMetatdata>, 
  name: String, 
  symbol: String,
  uri: String,
  // creators: Option<Vec<Creator>>,
  seller_fee_basis_points: u16,
  update_authority_is_signer: bool,
  is_mutable: bool,
  // collection: Option<Collection>,
  // uses: Option<Uses>,
) -> ProgramResult {
  let accounts = & ctx.accounts;

  let create_metadata_instruction = create_metadata_accounts_v2(
    *accounts.token_metadata_program.key,
    *accounts.metadata.key,
    accounts.mint.key(),
    *accounts.mint_authority.key,
    *accounts.payer.key,
    *accounts.update_authority.key,
    name,
    symbol,
    uri,
    None,
    seller_fee_basis_points,
    update_authority_is_signer,
    is_mutable,
    None,
    None,
  );

  let metadata_accounts_list: Vec<AccountInfo> = vec![
    accounts.token_metadata_program.to_account_info(),
    accounts.metadata.to_account_info(),
    accounts.mint.to_account_info(),
    accounts.mint_authority.to_account_info(),
    accounts.payer.to_account_info(),
    accounts.update_authority.to_account_info(),
    accounts.system_program.to_account_info(),
    accounts.token_program.to_account_info(),
    accounts.rent.to_account_info(),
  ];

  invoke(
    &create_metadata_instruction, 
    metadata_accounts_list.as_slice(),
  )?;

  Ok(())
}

pub fn process_create_mint_governance(
  ctx: Context<CreateMintGovernace>
) -> ProgramResult {
  let accounts = ctx.accounts;
  accounts.mint_governance.mint = accounts.mint.key();

  let auth_ix = set_authority(
    accounts.token_program.key,
    &accounts.mint.key(),
    Some(&accounts.mint_governance.key()),
    AuthorityType::MintTokens,
    accounts.prev_mint_authority.key,
    &[accounts.prev_mint_authority.key],
  )?;

  invoke(
    &auth_ix,
    &[
      accounts.token_program.to_account_info(),
      accounts.mint_governance.to_account_info(),
      accounts.mint.to_account_info(),
      accounts.prev_mint_authority.to_account_info(),
    ],
  )?;

  Ok(())
}

pub fn process_mint_community_token_to_nft_holder(
  ctx: Context<MintCommunityTokenToNftHolder>,
  gov_nonce: u8,
) -> ProgramResult {
  let accounts = ctx.accounts;

  accounts.once.used = true;

  // CTigLqsToNwfL8kRiC8Gjtahtahr8DXU9kBnbNwhsgJA
  let verify_address = Pubkey::new(&[170, 72, 200, 117, 142, 195, 31, 57, 177, 13, 121, 223, 80, 180, 194, 199, 221, 230, 189, 132, 180, 128, 30, 92, 246, 153, 238, 133, 18, 200, 207, 175]);

  if accounts.nft_token_account.owner != accounts.user.key() {
    msg!(
      "Signer does not own NFT token account"
    );
    return Err(ProgramError::InvalidSeeds);
  }

  if accounts.nft_token_account.amount < 1 {
    msg!(
      "NFT token account is empty"
    );
    return Err(ProgramError::InvalidSeeds);
  }

  let metadata = Metadata::from_account_info(&accounts.nft_metadata_account.to_account_info())?;
  let fst_creator = metadata.data.creators.unwrap()[0].address;

  // msg!("{:?} {:?}", metadata.data.creators.unwrap()[0].address, verify_address);

  if fst_creator != verify_address {
    msg!(
        "NFT not from correct collection",
    );
    return Err(ProgramError::InvalidSeeds);
  }

  let mint_ix = mint_to(
    accounts.token_program.key,
    &accounts.token_mint.key(),
    &accounts.user_token_account.key(),
    &accounts.mint_governance.key(),
    &[&accounts.mint_governance.key()],
    1,
  )?;

  invoke_signed(
    &mint_ix,
    &[
      accounts.token_mint.to_account_info(),
      accounts.user_token_account.to_account_info(),
      accounts.token_program.to_account_info(),
      accounts.mint_governance.to_account_info(),
    ],
    &[&[b"mint-gov", accounts.token_mint.key().as_ref(), &[gov_nonce]]],
  )?;

  Ok(())
}

pub fn process_mint_community_token_through_realm(
  ctx: Context<MintCommunityTokenThroughRealm>,
  gov_nonce: u8,
  amount: u64,
) -> ProgramResult {
  let accounts = ctx.accounts;

  let mint_ix = mint_to(
    accounts.token_program.key,
    &accounts.token_mint.key(),
    &accounts.user_token_account.key(),
    &accounts.mint_governance.key(),
    &[&accounts.mint_governance.key()],
    amount,
  )?;

  invoke_signed(
    &mint_ix,
    &[
      accounts.token_mint.to_account_info(),
      accounts.user_token_account.to_account_info(),
      accounts.token_program.to_account_info(),
      accounts.mint_governance.to_account_info(),
    ],
    &[&[b"mint-gov", accounts.token_mint.key().as_ref(), &[gov_nonce]]],
  )?;

  Ok(())
}