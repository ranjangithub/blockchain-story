"use client";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";
import NFTDemo from "@/components/demos/NFTDemo";

export default function Scene42() {
  return (
    <SceneLayout sceneId={42}>
      <Narrator>
        Before we get to NFTs, we need to understand where standards come from in Ethereum —
        because ERC-721 didn't appear by decree. It was proposed, argued over, and refined
        by the community using a process called EIPs: Ethereum Improvement Proposals.
        Anyone can write an EIP. It's a GitHub pull request, open for comment, modeled
        on the IETF's RFC process — the same process that standardized email,
        HTTP, and most of the internet. When an EIP concerns application-level interfaces
        like token standards, it gets the label ERC: Ethereum Request for Comment.
        ERC-20 was EIP number 20. ERC-721 was EIP number 721.
      </Narrator>
      <Narrator>
        ERC-20, proposed in November 2015 by developer Fabian Vogelsteller, defined
        fungible tokens: every unit is identical. Any 1 USDC equals any other 1 USDC.
        ERC-20 stores one number per address — your balance.
        The underlying data structure: a mapping from address to amount.
        It was perfect for currencies. It was completely wrong for collectibles.
        You can't say "I own USDC token number 7,432." USDC tokens don't have numbers.
        They're interchangeable. But if you want to own a specific thing —
        a specific piece of art, a specific piece of land, ticket seat 7A —
        you need tokens with identity. You need non-fungibility.
      </Narrator>
      <Narrator>
        December 2017. Dapper Labs launches CryptoKitties — digital cats you can breed
        and trade on Ethereum. Each cat is unique. Each has its own ID, its own traits.
        CryptoKitties invents non-fungible tokens before any standard for them exists.
        The game becomes so popular it clogs the Ethereum network — 30% of all transactions
        at peak. Gas prices spike. Transactions queue for hours. CryptoKitties proves
        that people desperately want unique digital items on a blockchain.
        It also proves Ethereum needs a standard for them.
      </Narrator>
      <Narrator>
        January 2018. William Entriken, Dieter Shirley, Jacob Evans, and Nastassia Sachs
        file ERC-721. It formalizes what CryptoKitties had already built, but with
        a clean interface any contract can implement. The key inversion from ERC-20:
        instead of tracking balance per owner, ERC-721 tracks owner per token ID.
        A new function appears: <code>ownerOf(tokenId)</code> — call it with any token number
        and the blockchain tells you exactly who owns that specific token right now.
        A second new function: <code>tokenURI(tokenId)</code> — returns a URL pointing to
        the token's metadata: its name, image, and traits. ERC-721 is finalized
        as an official Ethereum standard by June 2018.
      </Narrator>
      <NFTDemo />
      <Narrator>
        June 2021. Bored Ape Yacht Club launches — 10,000 algorithmically generated
        cartoon apes, minted at 0.08 ETH each ($190 at the time). They sell out
        in 12 hours. By January 2022, the cheapest Bored Ape costs $250,000.
        Token #8817 sells for 852 ETH — $3.4 million. The BAYC contract is nothing
        unusual: a standard ERC-721 with 10,000 tokens, images stored on IPFS,
        metadata in JSON files. What made the Bored Apes valuable had nothing to do
        with the contract code. It was community, culture, celebrity ownership,
        and network effects. The same ERC-721 standard that powers a $3.4M ape
        also powers a $0 NFT that nobody wants.
      </Narrator>
      <Narrator>
        The persistent question: what do you actually own? The blockchain permanently
        records that your address owns token #8817. But the image itself is not
        on the blockchain — it's a PNG file stored on IPFS, pinned by Yuga Labs.
        If the IPFS pins disappear, the image disappears. The blockchain entry
        pointing to token #8817 remains forever — pointing to nothing.
        Right-clicking and saving the image doesn't give you the blockchain entry.
        But it does prove that what you paid for was never the pixels.
        You paid for the provenance: the verifiable, immutable record that
        a specific address assigned this specific token to you.
        That's exactly as real as a deed of title, and exactly as dependent on
        the surrounding legal and social system to mean anything.
      </Narrator>
      <Narrator>
        Beyond speculation, ERC-721 has uses that will outlast any market cycle.
        Artists can encode royalties directly — every secondary sale automatically
        pays the original creator a percentage, with no intermediary.
        Concert tickets as NFTs are unforgeable and transferable without a Ticketmaster.
        University degrees issued as NFTs can be verified by anyone, instantly.
        Real estate deeds, supply chain provenance, in-game item ownership —
        any situation where you need a tamper-proof, publicly verifiable ownership record
        for a unique item is a legitimate ERC-721 use case. The 2021 mania was irrational.
        The underlying primitive is not.
      </Narrator>
      <SceneAdvance to={43} />
    </SceneLayout>
  );
}
