pub mod context;
pub mod processor;
pub mod error;
pub mod state;

use {
  anchor_lang::prelude::*,
  crate::context::*,
  crate::processor::*,
  solana_program::{
    entrypoint::ProgramResult,
  },
};

declare_id!("BN3cXU7X7DeVEDvUBCpr5oZMiM2VoLJyE5zrZuyEWnqs");

#[program]
pub mod vita_token {
  use super::*;

  pub fn create_token_with_metadata(
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
    process_create_token_with_metadata(
      ctx, name, symbol, uri,
      seller_fee_basis_points,
      update_authority_is_signer,
      is_mutable,
    )
  }

  pub fn create_mint_governance(
    ctx: Context<CreateMintGovernace>,
  ) -> ProgramResult {
    process_create_mint_governance(ctx)
  }

  pub fn mint_community_token_to_nft_holder(
    ctx: Context<MintCommunityTokenToNftHolder>,
    gov_nonce: u8,
  ) -> ProgramResult {
    process_mint_community_token_to_nft_holder(ctx, gov_nonce)
  }

  pub fn mint_community_token_through_realm(
    ctx: Context<MintCommunityTokenThroughRealm>,
    gov_nonce: u8,
    _realm_name: String,
    amount: u64,
  ) -> ProgramResult {
    process_mint_community_token_through_realm(
      ctx, 
      gov_nonce,
      amount,
    )
  }
}