import { SentimentSignalSkill, CMCIndicatorFeed, TechnicalIndicators } from "./sentiment-signal";
import { HistoricalBacktester } from "./backtest";

// ANSI Terminal Colors
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const BLUE = "\x1b[34m";
const MAGENTA = "\x1b[35m";
const CYAN = "\x1b[36m";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  const skill = new SentimentSignalSkill();
  const backtester = new HistoricalBacktester();

  console.clear();
  console.log(`${BOLD}${CYAN}========================================================================${RESET}`);
  console.log(`${BOLD}${MAGENTA}  BNB HACK TRACK 2: SENTIMENT DIVERGENCE ARBITRAGE SIGNAL SKILL DEMO  ${RESET}`);
  console.log(`${BOLD}${CYAN}========================================================================${RESET}\n`);

  console.log(`${YELLOW}[System Initialization]${RESET} Spawning Sentiment Signal Skill Engines...`);
  await delay(600);

  // --- 1. VERIFY find_skill INTENT ROUTING (Mandatory Requirement 1) ---
  console.log(`\n${BOLD}${GREEN}>>> STAGE 1: Testing "find_skill" Natural Language Intent Routing <<<\n${RESET}`);

  const testPrompts = [
    "Give me the sentiment divergence signal for BNB right now",
    "我想看看有什么情绪背离套利机会？",
    "What is the BNB current price?" // Neutral/low confidence
  ];

  for (const prompt of testPrompts) {
    const route = SentimentSignalSkill.find_skill(prompt);
    console.log(`  - Input Query: "${YELLOW}${prompt}${RESET}"`);
    console.log(`    ├─ Matched:    ${route.matched ? `${GREEN}TRUE${RESET}` : `${RED}FALSE${RESET}`}`);
    console.log(`    ├─ Intent:     ${CYAN}${route.intent}${RESET}`);
    console.log(`    └─ Confidence: ${BOLD}${route.confidence}%${RESET}`);
    await delay(300);
  }
  await delay(800);

  // --- 2. DEMO SCENARIO A: BEARISH TOP DIVERGENCE (Dumb FOMO vs Smart money exit) ---
  console.log(`\n${BOLD}${GREEN}>>> STAGE 2: Running Real-Time Scan - Scenario A: Bearish Top Divergence <<<\n${RESET}`);
  console.log(`${YELLOW}[CMC MCP Feed Ingesting]${RESET} Scanning BNB metrics...`);
  await delay(600);

  const topFeed: CMCIndicatorFeed = {
    symbol: "BNB",
    price: 852.30,
    fundingRate: 0.00095, // High positive funding rate -> Retail heavily long-leveraged
    longShortRatio: 1.58,  // Retail heavily buying long
    socialHotness: 96.0,  // Off-chain social hype is off the charts (Extreme FOMO)
    fearGreedIndex: 85,    // Global market is in Extreme Greed
    onChainNetFlowUSD: -12500000.0 // Institutions dumping heavily ($12.5M Net outflow in 24h)
  };

  const topTech: TechnicalIndicators = {
    rsi: 78.5,             // RSI is highly overbought
    macdHist: -1.5,        // Bearish MACD divergence showing loss of momentum
    emaShort: 840.0,
    emaLong: 780.0,
    atr: 32.5
  };

  console.log(`  [Telemetry Data]`);
  console.log(`    - CMC Social Hotness Index:   ${RED}${topFeed.socialHotness}/100 (FOMO)${RESET}`);
  console.log(`    - CMC Global Fear & Greed:     ${RED}${topFeed.fearGreedIndex} (Extreme Greed)${RESET}`);
  console.log(`    - CMC On-chain Big Wallet Flow: ${RED}-$${(Math.abs(topFeed.onChainNetFlowUSD)/1e6).toFixed(1)}M USD (Heavy Outflow)${RESET}`);
  console.log(`    - Technical Indicators:       RSI: ${RED}${topTech.rsi.toFixed(1)}${RESET} | MACD Histogram: ${RED}${topTech.macdHist.toFixed(1)}${RESET}`);
  await delay(1200);

  const topResult = skill.analyzeDivergence(topFeed, topTech);
  console.log(`\n  ${BOLD}${YELLOW}[Signal Engine Result]${RESET}`);
  console.log(`    ├─ Signal ID:           ${CYAN}${topResult.signalId}${RESET}`);
  console.log(`    ├─ Retail Hype Score:   ${RED}${topResult.retailSentimentScore}/100${RESET}`);
  console.log(`    ├─ Smart Money Index:   ${RED}${topResult.smartMoneyFlowIndex}/100 (Selling)${RESET}`);
  console.log(`    ├─ Divergence Pattern:  ${BOLD}${RED}${topResult.divergencePattern}${RESET}`);
  console.log(`    ├─ Recommended Action:  ${BOLD}${RED}🔴 ${topResult.recommendedAction}${RESET}`);
  console.log(`    └─ Rationale:           ${topResult.rationale}`);
  await delay(2000);

  // --- 3. DEMO SCENARIO B: BULLISH BOTTOM DIVERGENCE (Dumb Panic vs Smart money accumulation) ---
  console.log(`\n${BOLD}${GREEN}>>> STAGE 3: Running Real-Time Scan - Scenario B: Bullish Bottom Divergence <<<\n${RESET}`);
  console.log(`${YELLOW}[CMC MCP Feed Ingesting]${RESET} Ingesting BNB capitulation levels...`);
  await delay(600);

  const bottomFeed: CMCIndicatorFeed = {
    symbol: "BNB",
    price: 412.10,
    fundingRate: -0.00062, // Negative funding rate -> Retail heavily shorting
    longShortRatio: 0.52,   // Extreme short bias
    socialHotness: 12.0,    // Dead social sentiment (Retail Capitulation/Dread)
    fearGreedIndex: 16,     // Global market in Extreme Fear
    onChainNetFlowUSD: 18500000.0 // Institutions accumulating massively on-chain ($18.5M inflow)
  };

  const bottomTech: TechnicalIndicators = {
    rsi: 21.3,              // Deep oversold
    macdHist: 1.8,          // Golden cross forming on histogram
    emaShort: 410.0,
    emaLong: 440.0,
    atr: 28.0
  };

  console.log(`  [Telemetry Data]`);
  console.log(`    - CMC Social Hotness Index:   ${BLUE}${bottomFeed.socialHotness}/100 (Capitulation)${RESET}`);
  console.log(`    - CMC Global Fear & Greed:     ${BLUE}${bottomFeed.fearGreedIndex} (Extreme Fear)${RESET}`);
  console.log(`    - CMC On-chain Big Wallet Flow: ${GREEN}+$${(bottomFeed.onChainNetFlowUSD/1e6).toFixed(1)}M USD (Institutional Accumulation)${RESET}`);
  console.log(`    - Technical Indicators:       RSI: ${BLUE}${bottomTech.rsi.toFixed(1)}${RESET} | MACD Histogram: ${GREEN}+${bottomTech.macdHist.toFixed(1)}${RESET}`);
  await delay(1200);

  const bottomResult = skill.analyzeDivergence(bottomFeed, bottomTech);
  console.log(`\n  ${BOLD}${YELLOW}[Signal Engine Result]${RESET}`);
  console.log(`    ├─ Signal ID:           ${CYAN}${bottomResult.signalId}${RESET}`);
  console.log(`    ├─ Retail Hype Score:   ${BLUE}${bottomResult.retailSentimentScore}/100${RESET}`);
  console.log(`    ├─ Smart Money Index:   ${GREEN}+${bottomResult.smartMoneyFlowIndex}/100 (Accumulating)${RESET}`);
  console.log(`    ├─ Divergence Pattern:  ${BOLD}${GREEN}${bottomResult.divergencePattern}${RESET}`);
  console.log(`    ├─ Recommended Action:  ${BOLD}${GREEN}🟢 ${bottomResult.recommendedAction}${RESET}`);
  console.log(`    └─ Rationale:           ${bottomResult.rationale}`);
  await delay(2000);

  // --- 4. RUN SYSTEM BACKTEST (Mandatory Requirement 5) ---
  console.log(`\n${BOLD}${GREEN}>>> STAGE 4: Executing Multi-Metric 30-Day Historical Strategy Backtest <<<\n${RESET}`);
  console.log(`${YELLOW}[Backtester Initializing]${RESET} Ingesting 30 days of market telemetry data (BNB/BSC)...`);
  await delay(800);

  const backtestResult = backtester.runBacktest();

  // Print backtest daily logs in a neat streamable format
  for (const log of backtestResult.logs) {
    let actionStr = `${YELLOW}HOLD${RESET}`;
    if (log.action === "BUY") actionStr = `${GREEN}BUY${RESET}`;
    else if (log.action === "SELL") actionStr = `${RED}SELL${RESET}`;

    let patternStr = `${BLUE}Neutral${RESET}`;
    if (log.pattern === "BEARISH_TOP_DIVERGENCE") patternStr = `${BOLD}${RED}Top Div 🔴${RESET}`;
    else if (log.pattern === "BULLISH_BOTTOM_DIVERGENCE") patternStr = `${BOLD}${GREEN}Bottom Div 🟢${RESET}`;

    console.log(`  Day ${log.day.toString().padStart(2, "0")} | Price: $${log.price.toFixed(1)} | Action: ${actionStr.padEnd(12)} | Pattern: ${patternStr.padEnd(25)} | Net Asset Value: ${BOLD}$${log.portfolioValue.toFixed(2)}${RESET}`);
    await delay(100);
  }

  // --- 5. BACKTEST SUMMARY METRICS ---
  console.log(`\n${BOLD}${YELLOW}========================================================================${RESET}`);
  console.log(`${BOLD}${GREEN}                     HISTORICAL BACKTEST SUMMARY REPORT                 ${RESET}`);
  console.log(`${BOLD}${YELLOW}========================================================================${RESET}`);

  const m = backtestResult.metrics;
  console.log(`  - Starting Capital:      $${m.startingCapital.toFixed(2)} USD`);
  console.log(`  - Ending Capital:        ${BOLD}$${m.endingCapital.toFixed(2)} USD${RESET}`);
  console.log(`  - Total Strategy Return:  ${BOLD}${m.totalReturnPct >= 0 ? GREEN : RED}${m.totalReturnPct.toFixed(2)}%${RESET}`);
  console.log(`  - Total Signals Ingested: ${m.signalsCount}`);
  console.log(`  - Winning Closed Trades:  ${GREEN}${m.winCount}${RESET}`);
  console.log(`  - Losing Closed Trades:   ${RED}${m.lossCount}${RESET}`);
  console.log(`  - Cumulative Win Rate:   ${BOLD}${GREEN}${m.winRate.toFixed(2)}%${RESET}`);
  console.log(`  - Strategy Max Drawdown:  ${BOLD}${RED}${m.maxDrawdownPct.toFixed(2)}%${RESET}`);
  console.log(`${BOLD}${YELLOW}========================================================================${RESET}\n`);

  console.log(`${BOLD}${GREEN}🌟 STRATEGY EVALUATION RUN SUCCESSFULLY COMPLETED AND SHIPPED!${RESET}\n`);
}

run().catch((err) => {
  console.error("Execution error:", err);
});
