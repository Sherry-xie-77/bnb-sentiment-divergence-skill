import * as crypto from "crypto";

export interface CMCIndicatorFeed {
  symbol: string;
  price: number;
  fundingRate: number;      // Derivatives market funding rate
  longShortRatio: number;   // Professional long/short account ratio (> 1.2 is bullish tilt)
  socialHotness: number;    // CMC Community sentiment/posts density (0 to 100)
  fearGreedIndex: number;   // Global Fear & Greed index (0 to 100)
  onChainNetFlowUSD: number; // Big wallet smart money net flows in USD (positive = in, negative = out)
}

export interface TechnicalIndicators {
  rsi: number;              // Relative Strength Index (e.g. >70 is overbought, <30 is oversold)
  macdHist: number;         // MACD Histogram value
  emaShort: number;         // 7-day EMA price
  emaLong: number;          // 25-day EMA price
  atr: number;              // Average True Range (measures volatility size)
}

export interface SentimentSignalResult {
  signalId: string;
  symbol: string;
  retailSentimentScore: number; // Combined index of retail hype (0 to 100)
  smartMoneyFlowIndex: number;  // Combined index of institutional action (-100 to 100)
  divergencePattern: "BEARISH_TOP_DIVERGENCE" | "BULLISH_BOTTOM_DIVERGENCE" | "ALIGNED_MARKET" | "NEUTRAL_MARKET";
  recommendedAction: "BUY" | "SELL" | "HOLD";
  rsiStatus: string;
  macdCross: "GOLDEN_CROSS" | "DEATH_CROSS" | "STABLE";
  rationale: string;
  timestamp: string;
}

export class SentimentSignalSkill {

  /**
   * Track 2 Mandatory Requirement 1: Intent Routing (find_skill)
   * Dispatches user natural language prompts to our Sentiment Divergence skill
   */
  public static find_skill(userPrompt: string): { matched: boolean; intent: string; confidence: number } {
    const promptLower = userPrompt.toLowerCase();
    const keywords = [
      "sentiment", "divergence", "fomo", "panic", "arbitrage",
      "smart money", "fear & greed", "indicators", "top signal", "bottom signal",
      "情绪背离", "套利", "散户情绪", "大户资金", "顶背离", "底背离"
    ];

    let matchCount = 0;
    for (const word of keywords) {
      if (promptLower.includes(word)) {
        matchCount++;
      }
    }

    // Direct symbol mentions in queries
    const symbolMatches = promptLower.match(/\b(bnb|btc|eth|sol)\b/i);
    const hasSymbol = !!symbolMatches;

    if (matchCount >= 1 || (matchCount === 0 && promptLower.includes("signal") && hasSymbol)) {
      return {
        matched: true,
        intent: "SENTIMENT_DIVERGENCE_ARBITRAGE_ANALYSIS",
        confidence: Math.min(95, 40 + matchCount * 20 + (hasSymbol ? 15 : 0))
      };
    }

    return {
      matched: false,
      intent: "UNKNOWN",
      confidence: 10
    };
  }

  /**
   * Combined Multi-indicator Sentiment Divergence Analyzer
   * Core logic representing the classic "Smart Money vs. Dumb Money" arbitrage
   */
  public analyzeDivergence(feed: CMCIndicatorFeed, tech: TechnicalIndicators): SentimentSignalResult {
    const signalId = "sig-div-" + crypto.randomBytes(6).toString("hex");

    // 1. Calculate Retail Sentiment Score (FOMO/Panic gauge)
    // Combines Social Hotness, Fear & Greed, and Retail Long/Short tilt
    const socialWeight = feed.socialHotness * 0.4;
    const fgWeight = feed.fearGreedIndex * 0.4;
    const retailTilt = (feed.longShortRatio < 0.9 ? 20 : feed.longShortRatio > 1.3 ? 80 : 50) * 0.2;
    const retailSentimentScore = Math.min(100, Math.max(0, Math.floor(socialWeight + fgWeight + retailTilt)));

    // 2. Calculate Smart Money Flow Index (Institutional buying/selling gauge)
    // Normalized between -100 (heavy selling) and +100 (heavy buying)
    // Combines on-chain net flow relative to typical scale and funding rate pressure
    const flowScale = Math.min(100, Math.max(-100, Math.floor(feed.onChainNetFlowUSD / 100000))); // Scaled in $100K increments
    const fundingPressure = Math.floor(-feed.fundingRate * 50000); // Inverse relationship: High funding rate signals retail over-leverage (short incentive)
    const smartMoneyFlowIndex = Math.min(100, Math.max(-100, Math.floor(flowScale * 0.7 + fundingPressure * 0.3)));

    // 3. Technical Indicator Signalling (RSI, MACD Cross)
    const rsiStatus = tech.rsi > 70 ? "OVERBOUGHT" : tech.rsi < 30 ? "OVERSOLD" : "NEUTRAL";
    const emaTrend = tech.emaShort > tech.emaLong ? "BULLISH_EMA" : "BEARISH_EMA";

    let macdCross: "GOLDEN_CROSS" | "DEATH_CROSS" | "STABLE" = "STABLE";
    if (tech.macdHist > 0.5) macdCross = "GOLDEN_CROSS";
    else if (tech.macdHist < -0.5) macdCross = "DEATH_CROSS";

    // 4. Divergence Decision Matrix
    let recommendedAction: "BUY" | "SELL" | "HOLD" = "HOLD";
    let divergencePattern: "BEARISH_TOP_DIVERGENCE" | "BULLISH_BOTTOM_DIVERGENCE" | "ALIGNED_MARKET" | "NEUTRAL_MARKET" = "NEUTRAL_MARKET";
    let rationale = "";

    // SCENARIO A: Bearish Top Divergence (Retail is hyper-FOMO, but Smart Money is leaving)
    if (retailSentimentScore > 75 && smartMoneyFlowIndex < -15 && tech.rsi > 65) {
      divergencePattern = "BEARISH_TOP_DIVERGENCE";
      recommendedAction = "SELL";
      rationale = `[Divergence Alert: TOP SIGNAL] Retail Sentiment is extremely over-FOMO (${retailSentimentScore}/100) and RSI is Overbought (${tech.rsi.toFixed(1)}). However, On-chain Smart Money is actively exiting (Institutional Flow Index: ${smartMoneyFlowIndex}). This represents classic bearish distribution. Initiating Short/Sell position.`;
    }
    // SCENARIO B: Bullish Bottom Divergence (Retail is in extreme Panic, but Smart Money is quietly accumulating)
    else if (retailSentimentScore < 30 && smartMoneyFlowIndex > 15 && tech.rsi < 35) {
      divergencePattern = "BULLISH_BOTTOM_DIVERGENCE";
      recommendedAction = "BUY";
      rationale = `[Divergence Alert: BOTTOM SIGNAL] Retail Sentiment is in capitulation/fear (${retailSentimentScore}/100) and RSI is Oversold (${tech.rsi.toFixed(1)}). In contrast, On-chain Smart Money is rapidly accumulating (Institutional Flow Index: +${smartMoneyFlowIndex}). This shows strong bullish divergence. Initiating Long/Buy position.`;
    }
    // SCENARIO C: Aligned Market (Hype matches flows)
    else if ((retailSentimentScore > 60 && smartMoneyFlowIndex > 20) || (retailSentimentScore < 40 && smartMoneyFlowIndex < -20)) {
      divergencePattern = "ALIGNED_MARKET";
      recommendedAction = "HOLD";
      rationale = `[Market Log] Retail hype matches Institutional flow patterns. No arbitrage discrepancy exists. EMA Trend is ${emaTrend} and ATR indicates ${tech.atr.toFixed(1)} volatility. Position remains HOLD.`;
    }
    // SCENARIO D: Neutral flat market
    else {
      divergencePattern = "NEUTRAL_MARKET";
      recommendedAction = "HOLD";
      rationale = `[Market Log] Sideways rangebound activity. RSI is ${tech.rsi.toFixed(1)} (Neutral). Retail Score: ${retailSentimentScore}, Institutional Flow Index: ${smartMoneyFlowIndex}. Waiting for divergence structure to materialize.`;
    }

    return {
      signalId,
      symbol: feed.symbol,
      retailSentimentScore,
      smartMoneyFlowIndex,
      divergencePattern,
      recommendedAction,
      rsiStatus,
      macdCross,
      rationale,
      timestamp: new Date().toISOString()
    };
  }
}
