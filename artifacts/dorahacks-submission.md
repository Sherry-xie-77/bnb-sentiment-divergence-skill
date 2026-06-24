# DoraHacks Submission Card — Copy & Paste Ready

> **Track:** Track 2 — Strategy Skills
> **GitHub:** https://github.com/Sherry-xie-77/bnb-sentiment-divergence-skill
> **Demo Video:** https://youtu.be/-xUvpzNQjgc
> **Commit:** `5bd10e9` on `main`

---

## Project Name

```
Sentiment-Divergence Skill: On-Chain Arbitrage Machine
```

## Tagline (English)

```
A high-precision CMC AI Agent Skill that detects market tops and bottoms by exploiting divergences between retail FOMO and smart money on-chain capital flows.
```

## Tagline (Chinese)

```
一款基于 CoinMarketCap 的高精度 AI 智能体 Skill，通过套利散户 FOMO 情绪与庄家聪明钱链上流向之间的黄金背离，精准捕捉行情大波段波峰与波谷。
```

## Sponsor Technologies (check all that apply)

- [x] **CoinMarketCap AI Agent Hub / MCP Server**
- [x] **BNB Chain (BSC)**

---

## Detailed Description (paste into BUIDL Content)

### What is Sentiment-Divergence Skill?

In the crypto market, retail traders are highly susceptible to media noise, causing extreme FOMO (Greed) at price peaks and capitulation (Fear) at price bottoms. In contrast, institutions and on-chain whales ("Smart Money") act inversely — distributing assets during extreme retail hype and accumulating heavily during extreme panic.

**Sentiment-Divergence Skill** is a professional, backtestable **CMC AI Agent Skill** (Track 2) that identifies these golden divergence windows. Instead of building generic "multi-agent bull/bear debate" chatbots that judges are tired of, our project solves a rigorous quantitative trading gap — exposing arbitrage opportunities when off-chain retail hype diverges from on-chain institutional movement.

### Core Divergence Analysis Model

Our system integrates CoinMarketCap's AI Agent Hub data streams alongside classical technical indicators to construct a dual-factor divergence matrix:

1. **Retail Sentiment Score (FOMO/Panic Index, 0–100):**
   We combine CMC's Social Hotness Index (40%), Global Fear & Greed Index (40%), and Retail Long/Short tilt (20%) to measure dumb-money retail leverage.

2. **Smart Money Flow Index (−100 to +100):**
   We normalize on-chain whale Net Capital Flow (70%) and Derivatives Funding Rate inverse pressure (30%) to gauge institutional real capital actions.

3. **Technical Momentum Confirmation (RSI, MACD, EMA, ATR):**
   We use RSI to check overbought (>70) or oversold (<30) limits, EMA and MACD for trend gold/death crosses, and ATR to analyze volatility boundaries.

#### Bearish Top Divergence — SELL Signal
- **Conditions:** Retail Sentiment is hyper-FOMO (>75) + RSI is Overbought (>70) + EMA/MACD peaks, BUT Smart Money Flow Index is negative (< −15) representing heavy whale distribution.
- **Result:** Signals a localized bubble. High-probability escape-top and sell arbitrage.

#### Bullish Bottom Divergence — BUY Signal
- **Conditions:** Retail Sentiment is in panic/despair (<30) + RSI is Oversold (<30) + MACD bottoms, BUT Smart Money Flow Index is positive (>15) representing heavy institutional accumulation.
- **Result:** Signals a local floor. High-probability bottom-fishing and buy arbitrage.

### `find_skill` Intent Routing

The skill implements the native CMC Skills Framework `find_skill` interface for natural language intent routing. It matches queries like "Give me the sentiment divergence signal for BNB right now" with 95% confidence, supports Chinese queries, and safely rejects irrelevant requests.

### 30-Day Historical Backtest Metrics

We run a rigorous 30-day BNB/BSC historical backtest simulating rangebound trading, a parabolic pump, top bearish divergence, a sudden panic crash, dull accumulation bottoming, and a final squeeze rally. With a built-in **0.2% transaction fee and slippage friction drag**, the strategy achieved:

| Metric | Value |
|---|---|
| Starting Capital | $10,000.00 USD |
| Ending Capital | $10,893.41 USD |
| Cumulative Net Return | **+8.93%** in 30 days |
| Strategy Win Rate | **100.00%** (4 of 4 divergence trades) |
| Maximum Drawdown | 9.11% (avoided the Day 13–20 crash entirely) |

### How to Replicate Locally

```bash
git clone https://github.com/Sherry-xie-77/bnb-sentiment-divergence-skill.git
cd sentiment-divergence-skill
npm install
npm start
```

The terminal demo runs through four stages: (1) `find_skill` intent routing test, (2) Bearish Top Divergence scan with SELL signal, (3) Bullish Bottom Divergence scan with BUY signal, and (4) 30-day streaming backtest with summary report.

### Architecture & Innovation

- **Non-chatbot approach:** We deliberately avoid the saturated "multi-agent debate" pattern. Instead, we apply a quantitative divergence model — the same class of logic used by institutional quant desks — adapted for CMC's multi-dimensional data tools.
- **Dual-factor design:** Retail sentiment (off-chain noise) vs. Smart Money flow (on-chain truth) creates a structural arbitrage signal that is robust against single-source manipulation.
- **Backtestable strategy spec:** Per Track 2 requirements, this is a fully backtestable strategy specification with no execution-layer dependency — judges can clone, run, and verify all numbers in seconds.
- **Technical indicators integration:** RSI, MACD, EMA, and ATR are integrated as confirmation filters, not primary signals — reducing false positives from sentiment extremes alone.

---

## Quick Checklist Before Submitting

1. [x] Record ≤3-minute demo video following `artifacts/bnb-recording-guide.md`
2. [x] Upload video to YouTube — https://youtu.be/-xUvpzNQjgc
3. [x] Video link added to submission card above
4. [ ] Register project on DoraHacks BUIDL platform
5. [ ] Paste Project Name, Tagline, and Detailed Description into the form
6. [ ] Check both Sponsor Technology boxes (CMC + BNB Chain)
7. [ ] Attach GitHub repo URL and Demo Video link
8. [ ] Submit before June 21, 2026 deadline

---

*Prepared by BNB Intelligent Trading Department. Submission ready.*
