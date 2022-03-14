use {
  anchor_lang::{prelude::*},
  anchor_spl::token::{Token, Mint, TokenAccount},
  crate::state::*,
};

#[derive(Accounts)]
pub struct CreateTokenWithMetatdata<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,
  #[account(
    mut,
    seeds = [
      b"metadata",  
      mpl_token_metadata::ID.as_ref(),
      mint.key().as_ref(),
    ],
    seeds::program = mpl_token_metadata::ID,
    bump,
  )]
  /// CHECK: Dw its fine
  pub metadata: UncheckedAccount<'info>,
  #[account()]
  pub mint: Account<'info, Mint>,
  #[account(mut)]
  pub mint_authority: Signer<'info>,
  #[account(mut)]
  /// CHECK: Arbitrary account
  pub update_authority: UncheckedAccount<'info>,
  #[account(address = mpl_token_metadata::id())]
  /// CHECK: Dw its fine
  pub token_metadata_program: UncheckedAccount<'info>,
  pub system_program: Program<'info, System>,
  pub token_program: Program<'info, Token>,
  pub rent: Sysvar<'info, Rent>
}

#[derive(Accounts)]
pub struct CreateMintGovernace<'info> {
  #[account(
    init, payer = payer,
    space = 64,
    seeds = [
      b"mint-gov",
      mint.key().as_ref(),
    ],
    bump,
  )]
  pub mint_governance: Account<'info, MintGovernance>,
  #[account(mut)]
  pub mint: Account<'info, Mint>,
  #[account(mut)]
  pub prev_mint_authority: Signer<'info>,
  #[account(mut)]
  pub payer: Signer<'info>,
  pub token_program: Program<'info, Token>,
  pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(gov_nonce: u8)]
pub struct MintCommunityTokenToNftHolder<'info> {
  #[account(mut)]
  pub token_mint: Account<'info, Mint>,
  #[account(
    seeds = [
      b"mint-gov",
      token_mint.key().as_ref(),
    ],
    bump = gov_nonce
  )]
  pub mint_governance: Account<'info, MintGovernance>,
  #[account(mut)]
  pub user_token_account: Account<'info, TokenAccount>,
  #[account(mut)]
  pub user: Signer<'info>,
  #[account(mut)]
  pub payer: Signer<'info>,
  #[account()]
  pub nft_mint: Account<'info, Mint>,
  #[account()]
  pub nft_token_account: Account<'info, TokenAccount>,
  #[account(
    seeds = [
      b"metadata",  
      mpl_token_metadata::ID.as_ref(),
      nft_mint.key().as_ref(),
    ],
    seeds::program = mpl_token_metadata::ID,
    bump,
  )]
  /// CHECK: Dw
  pub nft_metadata_account: UncheckedAccount<'info>,
  #[account(
    init, payer = payer,
    space = 16,
    seeds = [
      b"single use",
      token_mint.key().as_ref(),
      nft_mint.key().as_ref(),
    ],
    bump,
  )]
  pub once: Account<'info, SingleUse>,
  pub token_program: Program<'info, Token>,
  pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(
  gov_nonce: u8,
  realm_name: String,
)]
pub struct MintCommunityTokenThroughRealm<'info> {
  #[account(
    seeds = [
      b"governance",
      realm_name.as_bytes(),
    ],
    bump,
    seeds::program = governacne_program.key,
  )]
  /// CHECK: Dw
  pub realm: UncheckedAccount<'info>,
  #[account(
    seeds = [
      b"program-governance",
      realm.key.as_ref(),
      program_id.as_ref(),
    ],
    bump,
    seeds::program = governacne_program.key,
  )]
  pub program_governance: Signer<'info>,
  #[account(mut)]
  pub token_mint: Account<'info, Mint>,
  #[account(
    seeds = [
      b"mint-gov",
      token_mint.key().as_ref(),
    ],
    bump = gov_nonce
  )]
  pub mint_governance: Account<'info, MintGovernance>,
  #[account(mut)]
  pub user_token_account: Account<'info, TokenAccount>,
  // #[account(mut)]
  // pub payer: Signer<'info>,
  #[account(
    address = Pubkey::new(&[234, 228, 53, 189, 238, 117, 183, 52, 205, 89, 62, 207, 154, 48, 75, 128, 36, 186, 40, 152, 103, 183, 105, 177, 249, 60, 167, 187, 184, 142, 70, 254])
  )]
  /// CHECK: Dw
  pub governacne_program: UncheckedAccount<'info>,
  pub token_program: Program<'info, Token>,
}