import * as crypto from "crypto";

export interface Position {
  token: string;
  side: "LONG" | "SHORT" | "NONE";
  entryPrice: number;
  currentPrice: number;
  size: number; // Token units
  unrealizedPnL: number; // in USD
}

export class SentinelRiskMonitor {
  private maxDrawdownLimit = 0.035; // Strict 3.5% rule
  private peakValue = 10000.0; // Starting baseline portfolio capital simulation
  private currentValue = 10000.0;
  private maxDrawdownSeen = 0.0;

  // Active simulated positions
  private activePosition: Position = {
    token: "BNB",
    side: "NONE",
    entryPrice: 0,
    currentPrice: 0,
    size: 0,
    unrealizedPnL: 0
  };

  public getStatus() {
    return {
      peakValue: this.peakValue,
      currentValue: this.currentValue,
      maxDrawdownSeen: this.maxDrawdownSeen,
      activePosition: { ...this.activePosition }
    };
  }

  public openSimulatedPosition(token: string, side: "LONG" | "SHORT", entryPrice: number, capitalAllocated: number) {
    const size = capitalAllocated / entryPrice;
    this.activePosition = {
      token,
      side,
      entryPrice,
      currentPrice: entryPrice,
      size,
      unrealizedPnL: 0
    };
  }

  // Updates current market conditions, updates position PnL, calculates peak and max drawdown.
  // Returns true if "Grim Reaper" emergency auto-liquidation (forced stopout) was triggered!
  public tick(newPrice: number): { liquidated: boolean; pnl: number; mdd: number; txHash?: string } {
    if (this.activePosition.side === "NONE") {
      return { liquidated: false, pnl: 0, mdd: this.maxDrawdownSeen };
    }

    this.activePosition.currentPrice = newPrice;
    let pnl = 0;
    if (this.activePosition.side === "LONG") {
      pnl = (newPrice - this.activePosition.entryPrice) * this.activePosition.size;
    } else if (this.activePosition.side === "SHORT") {
      pnl = (this.activePosition.entryPrice - newPrice) * this.activePosition.size;
    }

    this.activePosition.unrealizedPnL = pnl;
    this.currentValue = 10000.0 + pnl;

    if (this.currentValue > this.peakValue) {
      this.peakValue = this.currentValue;
    }

    const drawdown = (this.peakValue - this.currentValue) / this.peakValue;
    if (drawdown > this.maxDrawdownSeen) {
      this.maxDrawdownSeen = drawdown;
    }

    // "Grim Reaper" strict rule: Auto liquidate immediately if drawdown exceeds 3.5%
    if (drawdown >= this.maxDrawdownLimit) {
      const emergencyHash = "0x" + crypto.createHash("sha256").update(`liquidate:${Date.now()}:${this.activePosition.token}`).digest("hex");
      this.activePosition = {
        token: "BNB",
        side: "NONE",
        entryPrice: 0,
        currentPrice: 0,
        size: 0,
        unrealizedPnL: 0
      };
      // Reset values safely post-stopout
      this.currentValue = 10000.0 - (10000.0 * drawdown);
      this.peakValue = this.currentValue;

      return {
        liquidated: true,
        pnl,
        mdd: drawdown,
        txHash: emergencyHash
      };
    }

    return {
      liquidated: false,
      pnl,
      mdd: drawdown
    };
  }
}
