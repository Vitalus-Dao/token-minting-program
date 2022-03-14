use anchor_lang::prelude::*;

#[account]
pub struct MintGovernance {
  pub mint: Pubkey,
}

#[account]
pub struct SingleUse {
  pub used: bool,
}