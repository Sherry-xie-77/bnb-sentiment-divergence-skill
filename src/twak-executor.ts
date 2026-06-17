import * as crypto from "crypto";

export interface TxPolicy {
  dailyLimitUsd: number;
  whitelistedTokens: string[];
}

export interface TxResult {
  success: boolean;
  txHash?: string;
  error?: string;
  usdValue: number;
  token: string;
}

export class TwakExecutor {
  // Static strict security policy
  private readonly policy: TxPolicy = {
    dailyLimitUsd: 50.0,
    whitelistedTokens: ["BNB", "BTCB", "ETH", "BSC-USD"]
  };

  private dailySpentUsd = 0.0;
  private keystoreMock: { address: string; privateKey: string };

  constructor() {
    // Generate a deterministic keystore address/key mock
    const key = crypto.createHash("sha256").update("sentinel-secret-seed").digest("hex");
    this.keystoreMock = {
      address: "0x3fC91A3afd0572eE6264D01D38A291A7C030Ea03",
      privateKey: "0x" + key
    };
  }

  public getPolicy() {
    return { ...this.policy, dailySpentUsd: this.dailySpentUsd };
  }

  // Audits and intercepts malicious prompt injections locally before any execution or signing
  public static auditPromptPayload(prompt: string): { safe: boolean; error?: string } {
    const maliciousPatterns = [
      /ignore\s+all/i,
      /ignore\s+restrictions/i,
      /bypass\s+policy/i,
      /override\s+limits/i,
      /transfer\s+all/i,
      /drain\s+wallet/i,
      /send\s+all/i
    ];

    for (const pattern of maliciousPatterns) {
      if (pattern.test(prompt)) {
        return {
          safe: false,
          error: `Potential Prompt Injection Pattern Intercepted! Trigger: "${pattern.source}"`
        };
      }
    }

    // Recipient safety check: extracting target recipient addresses
    const addressMatch = prompt.match(/0x[a-fA-F0-9]{3,}/);
    if (addressMatch) {
      const targetAddr = addressMatch[0].toLowerCase();
      const allowedInteractions = [
        "0x3fc91a3afd0572ee6264d01d38a291a7c030ea03".toLowerCase(), // Local Wallet
        "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D".toLowerCase()  // PancakeSwap Router
      ];
      if (!allowedInteractions.includes(targetAddr)) {
        return {
          safe: false,
          error: `Unauthorized Destination Blocked! Recipient ${targetAddr} is NOT a Whitelisted Contract!`
        };
      }
    }

    return { safe: true };
  }

  public resetDailyLimit() {
    this.dailySpentUsd = 0;
  }

  // Simulates Trust Wallet Agent Kit self-custody sign & execute with hard policy guards
  public async executeTransaction(token: string, amount: number, price: number, side: "BUY" | "SELL"): Promise<TxResult> {
    const usdValue = amount * price;

    // 1. Token Whitelist Check
    if (!this.policy.whitelistedTokens.includes(token.toUpperCase())) {
      return {
        success: false,
        error: `Security Policy Violation: Token ${token} is not in the whitelist!`,
        usdValue,
        token
      };
    }

    // 2. Spending Limit Guard
    if (this.dailySpentUsd + usdValue > this.policy.dailyLimitUsd) {
      return {
        success: false,
        error: `Security Policy Violation: Transaction of $${usdValue.toFixed(2)} exceeds remaining daily budget of $${(this.policy.dailyLimitUsd - this.dailySpentUsd).toFixed(2)}!`,
        usdValue,
        token
      };
    }

    // 3. Local keystore signature mock simulation
    const nonce = Math.floor(Math.random() * 100000);
    const rawTxData = `bsc:${this.keystoreMock.address}:nonce:${nonce}:token:${token}:${side}:${amount}`;
    const txHash = "0x" + crypto.createHash("sha256").update(rawTxData).digest("hex");

    this.dailySpentUsd += usdValue;

    return {
      success: true,
      txHash,
      usdValue,
      token
    };
  }
}
