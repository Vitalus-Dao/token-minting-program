import 'dotenv/config';
import { getLocalKeyypair, getProvider } from '@helpers/mixins';
import { PublicKey, sendAndConfirmTransaction, Transaction } from '@solana/web3.js';
import { CreateMintGovernance } from '@instructions/CreateMintGovernace';
import { MintCommunityTokenToNftHolder } from '@instructions/MintCommunityTokenToNftHolder';
import { MintCommunityTokenThroughRealm } from '@instructions/MintCommunityTokenThroughRealm';
import { CreateTokenWithMetadata } from '@instructions/CreateTokenWithMetadata';
import { serializeInstructionToBase64 } from '@solana/spl-governance';


const main = async () => {
  const args = process.argv.slice(2);
  const provider = getProvider();
  const user = getLocalKeyypair(process.env.SOLANA_WALLET_FILEPATH);
  
  const tx = new Transaction();
  const signers = [user];

  let sendTx = true;
  switch(Number(args[0])) {
    case 0: {
      tx.add(
        await CreateMintGovernance(
          user, 
          user,
          new PublicKey(args[1])
        ),
      );

      break;
    }

    case 1: {
      if(args.length < 3) {
        throw new Error("Please provide nft mint address and containing token account address as arguments.");
      }
      tx.add(
        await MintCommunityTokenToNftHolder(
          user,
          new PublicKey(args[1]),
          new PublicKey(args[2]),
          new PublicKey(args[3])
        ),
      );

      break;
    }

    case 2: {
      if(args.length < 2) {
        throw new Error("Please provide amount to mint as argument.");
      }

      sendTx = false;
      const amount = Number(args[1]);
      
      if(!isNaN(amount) || amount < 1){
        const ix = await MintCommunityTokenThroughRealm(user, amount);
        const buf = serializeInstructionToBase64(ix);

        console.log(buf);
        // return buf;
      } else {
        throw new Error("Invalid number passed as amount.")
      }

      break;
    }

    case 4: {
      if(args.length < 3) {
        throw new Error("Please provide at least token name, symbol as arguments.");
      }

      tx.add(
        await CreateTokenWithMetadata(
          user, user,
          args[1], args[2], 
          args[3], Number(args[4]), 
          args[5] ? getLocalKeyypair(args[5]) : null,
        ),
      );

      break;
    }

    default: {
      throw new Error("No arguments provided.");
    }
  }

  if(sendTx){
    const txId = await sendAndConfirmTransaction(
      provider.connection,
      tx, signers,
    );

    return txId;
  } else {
    return null;
  }
}

main()
  .then((txId) => {
    if(txId)
      console.log(`https://explorer.solana.com/tx/${txId}?cluster=devnet`);
    else
      console.log("Success");
  })
  .catch((e) => {
    console.error("Error:", e.message);
  });