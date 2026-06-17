import { SentimentSignalSkill, CMCIndicatorFeed, TechnicalIndicators } from "./sentiment-signal";

export interface BacktestMetrics {
  startingCapital: number;
  endingCapital: number;
  totalReturnPct: number;
  signalsCount: number;
  winCount: number;
  lossCount: number;
  winRate: number;
  maxDrawdownPct: number;
}

export interface DailyResultLog {
  day: number;
  price: number;
  action: "BUY" | "SELL" | "HOLD";
  pattern: string;
  portfolioValue: number;
  dailyReturnPct: number;
}

export class HistoricalBacktester {
  private startingCapital = 10000.0;
  private currentCapital = 10000.0;
  private maxDrawdown = 0.0;
  private peakCapital = 10000.0;

  // Track trade execution details
  private activePosition: { type: "LONG" | "SHORT" | "NONE"; entryPrice: number; size: number } = {
    type: "NONE",
    entryPrice: 0,
    size: 0
  };

  /**
   * Generates a 30-day realistic market scenario for BNB on BSC
   * Includes standard FOMO top distribution and capitulation bottom accumulation
   */
  public generate30DayHistoricalData(): { feed: CMCIndicatorFeed; tech: TechnicalIndicators }[] {
    const data: { feed: CMCIndicatorFeed; tech: TechnicalIndicators }[] = [];
    const basePrice = 600.0;

    for (let day = 1; day <= 30; day++) {
      let price = basePrice;
      let fundingRate = 0.0001;
      let longShortRatio = 1.0;
      let socialHotness = 50;
      let fearGreedIndex = 50;
      let onChainNetFlowUSD = 0; // Smart money flows

      let rsi = 50;
      let macdHist = 0.0;
      let emaShort = basePrice;
      let emaLong = basePrice;
      let atr = 15.0;

      // STAGE 1: Days 1-8 (Gradual price climb, retail starting to notice)
      if (day >= 1 && day <= 8) {
        price = basePrice + day * 12; // $600 -> $696
        fundingRate = 0.0001 + day * 0.00005;
        socialHotness = 50 + day * 3; // 50 -> 74
        fearGreedIndex = 50 + day * 3; // 50 -> 74
        onChainNetFlowUSD = 150000 - day * 10000; // Smart money starts quiet distributing
        rsi = 50 + day * 2.2; // 50 -> 67.6
        emaShort = price - 2;
        emaLong = price - 8;
      }
      // STAGE 2: Days 9-12 (Extreme Retail FOMO, parabolic price climax but institutions are dumping)
      // ==> Triggers TOP Bearish Divergence!
      else if (day >= 9 && day <= 12) {
        price = 696 + (day - 8) * 35; // $696 -> $836 (Parabolic FOMO peak)
        fundingRate = 0.0008; // Retail highly leveraged
        longShortRatio = 1.5; // High retail long leverage
        socialHotness = 85 + (day - 8) * 3; // 85 -> 97 (Hyper FOMO)
        fearGreedIndex = 82; // Extreme greed
        onChainNetFlowUSD = -450000 - (day - 8) * 50000; // Institutions dumping big size on-chain!
        rsi = 72 + (day - 8) * 2; // 72 -> 80 (Overbought)
        macdHist = -1.2; // MACD showing bearish momentum decay
        emaShort = price - 5;
        emaLong = price - 20;
      }
      // STAGE 3: Days 13-20 (The Crash & Capitulation panic)
      else if (day >= 13 && day <= 20) {
        price = 836 - (day - 12) * 45; // $836 -> $476 (Hard panic liquidation)
        fundingRate = -0.0004; // Negative funding
        longShortRatio = 0.7; // Shorts piling up
        socialHotness = 90 - (day - 12) * 8; // Social dies down, extreme dread
        fearGreedIndex = 40 - (day - 12) * 3.5; // Greedy -> Fear
        onChainNetFlowUSD = -100000 + (day - 12) * 20000; // Exit slows down
        rsi = 55 - (day - 12) * 4.5; // RSI drops
        macdHist = -4.0;
        emaShort = price + 15;
        emaLong = price + 40;
      }
      // STAGE 4: Days 21-25 (Extreme retail despair and capitulation, but institutions are quietly loading up)
      // ==> Triggers BOTTOM Bullish Divergence!
      else if (day >= 21 && day <= 25) {
        price = 476 - (day - 20) * 8; // $476 -> $436 (Dull despair capitulation bottom)
        fundingRate = -0.0006; // Shorts paying longs
        longShortRatio = 0.55; // Retail heavily shorting bottom
        socialHotness = 15; // Complete retail silence
        fearGreedIndex = 18; // Extreme fear
        onChainNetFlowUSD = 650000 + (day - 20) * 80000; // Large on-chain accumulation by smart money!
        rsi = 24 + (day - 20) * 1.1; // RSI oversold (< 30)
        macdHist = 0.8; // MACD histogram recovering, bullish divergence setup
        emaShort = price + 2;
        emaLong = price + 5;
      }
      // STAGE 5: Days 26-30 (The violent relief rally)
      else {
        price = 436 + (day - 25) * 32; // $436 -> $596 (Massive short-squeeze & rally)
        fundingRate = 0.0001;
        longShortRatio = 1.05;
        socialHotness = 45;
        fearGreedIndex = 52;
        onChainNetFlowUSD = 200000;
        rsi = 45 + (day - 25) * 4;
        macdHist = 2.5;
        emaShort = price - 5;
        emaLong = price - 12;
      }

      data.push({
        feed: {
          symbol: "BNB",
          price,
          fundingRate,
          longShortRatio,
          socialHotness,
          fearGreedIndex,
          onChainNetFlowUSD
        },
        tech: {
          rsi,
          macdHist,
          emaShort,
          emaLong,
          atr
        }
      });
    }

    return data;
  }

  /**
   * Executes historical backtest applying the Sentiment Divergence Signal Skill
   */
  public runBacktest(): { metrics: BacktestMetrics; logs: DailyResultLog[] } {
    const analyzer = new SentimentSignalSkill();
    const timeline = this.generate30DayHistoricalData();
    const logs: DailyResultLog[] = [];

    this.currentCapital = this.startingCapital;
    this.peakCapital = this.startingCapital;
    this.maxDrawdown = 0.0;
    this.activePosition = { type: "NONE", entryPrice: 0, size: 0 };

    let winCount = 0;
    let lossCount = 0;
    let signalsCount = 0;

    for (let day = 1; day <= timeline.length; day++) {
      const step = timeline[day - 1];
      const feed = step.feed;
      const tech = step.tech;

      // 1. Run the Sentiment Signal module to get divergence recommendation
      const analysis = analyzer.analyzeDivergence(feed, tech);

      // 2. Track existing position value mark-to-market
      let dayEndCapital = this.currentCapital;
      if (this.activePosition.type === "LONG") {
        const unrealizedPnl = (feed.price - this.activePosition.entryPrice) * this.activePosition.size;
        dayEndCapital = this.currentCapital + unrealizedPnl;
      } else if (this.activePosition.type === "SHORT") {
        const unrealizedPnl = (this.activePosition.entryPrice - feed.price) * this.activePosition.size;
        dayEndCapital = this.currentCapital + unrealizedPnl;
      }

      // 3. Process Signals (with simulated transaction fee & slippage of 0.2%)
      const feePct = 0.002;
      if (analysis.recommendedAction === "SELL") {
        signalsCount++;
        // If long, close it first
        if (this.activePosition.type === "LONG") {
          const pnl = (feed.price - this.activePosition.entryPrice) * this.activePosition.size;
          const fee = dayEndCapital * feePct;
          this.currentCapital = this.currentCapital + pnl - fee;
          if (pnl - fee > 0) winCount++; else lossCount++;
          this.activePosition = { type: "NONE", entryPrice: 0, size: 0 };
        }
        // Open short (allocate 50% of available capital)
        if (this.activePosition.type === "NONE") {
          const margin = this.currentCapital * 0.5;
          const fee = margin * feePct;
          this.currentCapital -= fee;
          this.activePosition = {
            type: "SHORT",
            entryPrice: feed.price,
            size: margin / feed.price
          };
        }
      }
      else if (analysis.recommendedAction === "BUY") {
        signalsCount++;
        // If short, close it first
        if (this.activePosition.type === "SHORT") {
          const pnl = (this.activePosition.entryPrice - feed.price) * this.activePosition.size;
          const fee = dayEndCapital * feePct;
          this.currentCapital = this.currentCapital + pnl - fee;
          if (pnl - fee > 0) winCount++; else lossCount++;
          this.activePosition = { type: "NONE", entryPrice: 0, size: 0 };
        }
        // Open long (allocate 50% of available capital)
        if (this.activePosition.type === "NONE") {
          const margin = this.currentCapital * 0.5;
          const fee = margin * feePct;
          this.currentCapital -= fee;
          this.activePosition = {
            type: "LONG",
            entryPrice: feed.price,
            size: margin / feed.price
          };
        }
      }

      // Re-calculate capital post trades
      if (this.activePosition.type === "LONG") {
        const pnl = (feed.price - this.activePosition.entryPrice) * this.activePosition.size;
        dayEndCapital = this.currentCapital + pnl;
      } else if (this.activePosition.type === "SHORT") {
        const pnl = (this.activePosition.entryPrice - feed.price) * this.activePosition.size;
        dayEndCapital = this.currentCapital + pnl;
      } else {
        dayEndCapital = this.currentCapital;
      }

      // Max Drawdown tracking
      if (dayEndCapital > this.peakCapital) {
        this.peakCapital = dayEndCapital;
      }
      const drawdown = (this.peakCapital - dayEndCapital) / this.peakCapital;
      if (drawdown > this.maxDrawdown) {
        this.maxDrawdown = drawdown;
      }

      const prevCapital = logs.length > 0 ? logs[logs.length - 1].portfolioValue : this.startingCapital;
      const dailyReturnPct = ((dayEndCapital - prevCapital) / prevCapital) * 100;

      logs.push({
        day,
        price: feed.price,
        action: analysis.recommendedAction,
        pattern: analysis.divergencePattern,
        portfolioValue: dayEndCapital,
        dailyReturnPct
      });
    }

    // Force close any open position at Day 30 to lock in final ending capital
    const finalStep = timeline[timeline.length - 1];
    if (this.activePosition.type !== "NONE") {
      let finalPnl = 0;
      if (this.activePosition.type === "LONG") {
        finalPnl = (finalStep.feed.price - this.activePosition.entryPrice) * this.activePosition.size;
      } else if (this.activePosition.type === "SHORT") {
        finalPnl = (this.activePosition.entryPrice - finalStep.feed.price) * this.activePosition.size;
      }
      this.currentCapital += finalPnl - (this.currentCapital * 0.002);
      if (finalPnl > 0) winCount++; else lossCount++;
    }

    const totalReturnPct = ((this.currentCapital - this.startingCapital) / this.startingCapital) * 100;
    const totalTrades = winCount + lossCount;
    const winRate = totalTrades > 0 ? (winCount / totalTrades) * 100 : 0.0;

    return {
      metrics: {
        startingCapital: this.startingCapital,
        endingCapital: this.currentCapital,
        totalReturnPct,
        signalsCount,
        winCount,
        lossCount,
        winRate,
        maxDrawdownPct: this.maxDrawdown * 100
      },
      logs
    };
  }
}
