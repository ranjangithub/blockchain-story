"use client";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";

export default function Scene39() {
  return (
    <SceneLayout sceneId={39}>
      <Narrator>
        By 2017, the ERC-20 standard made it trivial to create a token and sell it.
        Combine that with a bull market and speculative enthusiasm, and you get the ICO —
        Initial Coin Offering. A startup writes a whitepaper, creates a token, and sells
        that token directly to the public in exchange for ETH or BTC. No banks, no VCs,
        no accredited investor requirements. Anyone with crypto could buy in.
      </Narrator>
      <Narrator>
        The numbers were staggering. EOS raised $4.1 billion over a year-long token sale —
        the largest in history — before shipping a product. Telegram raised $1.7 billion
        for the TON blockchain before the SEC shut it down. Filecoin raised $257 million.
        Thousands of projects raised millions each. Total ICO funding in 2017: roughly $5 billion.
        The pitch was always the same: buy our token now, use it in our future ecosystem.
      </Narrator>
      <Narrator>
        The SEC noticed. Most ICO tokens looked like securities under US law — investments
        in a common enterprise with expectations of profit derived from others' work.
        Selling them without registration was illegal. By 2019, the SEC had charged
        dozens of projects, including Kik ($5M fine), Block.one ($24M fine, no admission),
        and Telegram (ordered to return $1.2B). Many founders fled jurisdictions.
        The ICO era collapsed into a fraud-and-lawsuit wasteland.
      </Narrator>
      <Narrator>
        What survived: the infrastructure. Token-based fundraising evolved into SAFTs
        (Simple Agreement for Future Tokens), IEOs (exchange-hosted sales), and eventually
        IDOs (decentralized exchange launches). The concept of issuing tokens to early
        community members — liquidity mining, airdrops, governance tokens — replaced
        the "buy our token before the product exists" model. The mechanism matured.
        The get-rich-quick layer got regulated away. The building layer stayed.
      </Narrator>
      <SceneAdvance to={40} />
    </SceneLayout>
  );
}
