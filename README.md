# From Satoshi to DeFi — An Interactive Blockchain Story

An interactive narrative that teaches blockchain from first principles. 47 scenes, 8 acts, 25 live demos. Every concept — hashing, proof of work, merkle trees, 51% attacks, AMMs, The DAO hack, DeFi summer — arrives exactly when the story needs it. All cryptography runs in your browser.

---

## The Real Story Behind This Project

*A LinkedIn article about two sleepless nights, a tweet that broke my brain, and what happens when you stop being afraid of the future.*

---

I've been meaning to build this for about a year.

An interactive explainer for blockchain. Not another "what is blockchain" Medium post. Something that actually teaches — where you feel like you're *there*. You're Satoshi's friend. You receive the email. You mine the genesis block. You watch Bitcoin grow from a PDF into a global financial layer.

I had the idea. I had the design. I had 30 days of half-written code, half-finished components, and a growing list of "I'll finish this on the weekend" excuses.

Then I saw a tweet.

---

**[@garrytan](https://x.com/garrytan/status/2020252961117802732) wrote something that cost me two nights of sleep.**

The idea: *our fear of the future is directly proportional to how small our ambitions are.*

And then he talked about "Boil the Ocean" — the principle that when AI makes the marginal cost of building something near-zero, you should just do the complete thing. Not the MVP. Not the happy path. The whole lake.

I read it at 11pm. By midnight I had downloaded Claude Code and installed gstack.

By 2am I had written more working code than in the previous two weeks combined.

---

**Here's what happened in the next 8 hours across two nights:**

I described what I wanted. Claude Code built it. Not scaffold — *it*. The actual thing. Scene by scene. Act by act. The reentrancy attack demo where you watch 3.6 million ETH drain in real time. The proof-of-stake validator grid that shows RANDAO selection and slashing. The BAYC NFT gallery that fetches real metadata from IPFS. The AMM curve that moves when you trade.

Things I had been avoiding for weeks — "that'll take a whole weekend" — took 20 minutes.

The blockchain story went from 12 scenes to 47. From 2 acts to 8. From "I'll finish this someday" to live on GitHub.

30 days of part-time work. 8 hours with the right tools.

---

**The thing nobody tells you about fear and ambition:**

We don't avoid big projects because they're hard. We avoid them because they reveal how small we've been thinking.

When I was building this the slow way — one component per weekend, one demo when I had energy — I told myself I was being realistic. Managing scope. Being a professional.

I was being afraid.

Afraid that the full version wouldn't be good enough. Afraid of all the scenes I hadn't written yet. Afraid of the gap between what I imagined and what I'd actually ship.

The tools don't just make you faster. They collapse the distance between idea and artifact so completely that the fear has nowhere to hide. You can't be afraid of building 47 scenes when you can literally see all 47 appearing on your screen in real time.

Garry was right. Our fear of the future really is proportional to how small our ambitions are. And the inverse is also true: when you let yourself want the whole thing, the fear mostly dissolves.

---

**What I used:**

- **[Claude Code](https://claude.ai/code)** — Anthropic's CLI that lets you build with Claude inside your actual terminal, on your actual codebase
- **[gstack](https://github.com/garrytan/gstack)** — a set of AI skills built on top of Claude Code. The `/office-hours` skill alone is worth the install.
- **Next.js 15, TypeScript, Tailwind, Framer Motion**
- **@noble/hashes** — the real SHA-256 running real cryptography in every demo, not fake visualizations
- **Two nights, roughly 8 hours total**

---

**The project itself:**

47 scenes across 8 acts. Starts in January 2009 with Satoshi's email. Ends with CBDCs, The Merge, and the full picture of what this technology actually is.

Every technical concept arrives when the story needs it. You don't study hash functions in the abstract — you watch Satoshi use them to solve a problem you already understand. That's the whole pedagogical bet: *narrative first, mechanism second.*

25 interactive demos, all running in your browser:
- SHA-256 hashing with real collision probability
- Wallet generation from private key → public key → address
- Mining the genesis block with a real nonce loop
- Merkle tree construction
- Network propagation across nodes
- The DAO reentrancy attack, step by step, with the white hat rescue
- AMM pricing curve (Uniswap x·y=k)
- Proof-of-stake validator selection and slashing
- Flash loan atomicity — what happens when repayment fails
- NFT ownership chain with real BAYC metadata

No wallet required. No account. No crypto. Just the story.

---

**If you're sitting on a half-finished project right now:**

You know the one. The thing you've been "almost done with" for three months. The project that's waiting for a weekend that never comes.

Download Claude Code. Install gstack. Describe what you want.

Don't ask for the MVP. Ask for the whole thing.

Boil the lake.

You'll be surprised how quickly the fear goes away when you can actually see it happening.

---

*The code is open source. The story is free. If you're a developer who understands code but never understood blockchain, this is for you.*

**[Try it →](https://github.com/ranjangithub/blockchain-story)**

---

## Run it yourself

```bash
git clone https://github.com/ranjangithub/blockchain-story.git
cd blockchain-story
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Start at Scene 1. Don't skip ahead.

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Cryptography | @noble/hashes, @noble/curves, @scure/base |
| Charts | Recharts |
| Runtime | Bun / Node 20 |

## Structure

```
app/
  page.tsx              # Home + table of contents
  scene/[id]/page.tsx   # Scene router (1–47)
components/
  narrative/            # SceneLayout, Narrator, SceneAdvance, SceneMenuDrawer
  demos/                # 25 interactive demo components
  scenes/               # Scene1–Scene47 content components
lib/
  scenes/registry.ts    # Scene metadata, progress tracking
```
