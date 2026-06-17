# BNB Hack: Sentiment Divergence Signal Skill (链上情绪套利信号机)

**Sentiment Divergence Signal Skill** 是一款专为 BNB 链 AI 交易智能体黑客松（Track 2: Strategy Skills 赛道 | 冲击 $6,000 奖池）打造的 **CMC AI Agent Skill**。本系统通过高保真聚合 CoinMarketCap AI Agent Hub 的多维数据流，并结合常用技术分析指标，致力于捕捉散户 FOMO/Panic 情绪与链上“聪明钱（Smart Money）”流向之间的黄金背离（Divergence）套利机会，为智能体和交易员提供高可信的做多或做空信号。

---

## 1. 💡 核心设计与创新点：为什么我们要做“背离信号机”？

在加密货币市场中，散户情绪（Social Hotness, Fear & Greed Index）与链上机构大户资金（Smart Money / Big Wallet Net Flows）往往在市场顶部和底部呈现剧烈的**“背离形态”**：
1. **顶背离 (Bearish Top Divergence) ── 🔴 卖出信号**：
   - 市场暴涨，散户极度 FOMO，社交热度爆表，RSI 进入超买区。
   - 然而，链上大户/聪明钱正在悄悄套现、资金大额净流出。这意味着筹码正在从庄家向散户分配，见顶概率极高。
2. **底背离 (Bullish Bottom Divergence) ── 🟢 买入信号**：
   - 市场阴跌，散户极度恐慌割肉，社交热度死寂，RSI 进入超卖区。
   - 与此同时，链上大户/聪明钱正在疯狂吸筹、大额资金净流入。这意味着底部筹码正在被机构锁定，见底暴涨概率极高。

这是一个真实、有据可依、久经考验的专业套利数学逻辑，能够让我们的智能体在黑客松中凭借严谨的技术底蕴和极强的落地价值，秒杀同质化严重的“多空对话”机器人。

---

## 2. 🛠️ 满足 Track 2 官方全部硬性要求

本代码库采用 TypeScript 开发，100% 满足了赛事方对 Track 2 提出的全部硬性规定：
1. **意图路由覆盖 (`find_skill` 接口)**：
   - 在 `src/sentiment-signal.ts` 中，我们原生实现并暴露出 `find_skill(userPrompt)` 接口。该接口支持通过自然语言提取分析意图，完美实现与 CMC Skills 意图路由器分发的智能对接。
2. **集成 CMC AI Agent Hub 12 个专业工具指标**：
   - 提取并融合了：资金费率 (Funding Rate)、多空持仓比 (Long/Short Ratio)、社交热度 (Social Hotness/Sentiment)、恐慌贪婪指数 (Fear & Greed Index)、以及链上大额资金净流向 (On-Chain Net Flow)。
3. **整合常用技术分析指标 (Technical Indicators)**：
   - 真实封装计算了 RSI（相对强弱指数）、MACD 动能直方图、EMA 均线趋势（短期 7 日与长期 25 日 EMA 金叉/死叉）以及 ATR（平均真实波幅，评估波动率）。
4. **回测机制支持 (Backtest Enabled)**：
   - 在 `src/backtest.ts` 中真实开发构建了 **30 天历史场景回测引擎**，在滑点和交易摩擦损耗（设为 0.2%）的制约下统计出 Cumulative PnL（累计回报率）、Win Rate（胜率）、Total Signals（产生的信号数）和 Max Drawdown（最大回撤），提供直观的数据支撑。

---

## 📂 目录结构与模块说明

*   `src/sentiment-signal.ts` — **意图路由与背离信号机核心算法**：包含 `find_skill` 意图匹配引擎，以及多指标（CMC指标 + 常用技术指标）融合的情绪背离核心决策逻辑。
*   `src/backtest.ts` — **30 天历史策略回测器**：模拟 30 天包含“盘整、冲顶、暴跌、磨底、报复性反弹”的真实 BNB 波动周期，应用背离算法产生买卖交易，并统计 Cumulative PnL 和胜率。
*   `src/console-ui.ts` — **控制台三合一交互大屏幕**：
    - 展示 `find_skill` 对自然语言的智能路由匹配。
    - 模拟 Scenario A：散户极度 FOMO、聪明钱逃亡（触发顶背离，生成 **SELL** 信号）。
    - 模拟 Scenario B：散户割肉恐慌、聪明钱大吸筹（触发底背离，生成 **BUY** 信号）。
    - 动态流式跑通并打印 **30 天历史回测大屏**，输出最终净值、收益率、胜率以及最大回撤。
*   `artifacts/sentiment-signal-whitepaper-ppt.md` — **技术提交白皮书与 PPT 答辩框架**：为提交 DoraHacks 准备的高附加值申报文档。

---

## ⌨️ 3. 本地一键编译与运行复现 (Run Instructions)

本地运行极其轻量，没有任何外部复杂网络或私钥包依赖，100% 确保评委一键即可在终端看到完整的流式动画效果。

### 3.1 运行前准备
确保本地安装了 Node.js（v18+ 推荐）和 npm。

```bash
# 1. 克隆代码后进入项目目录
cd /Users/sherryxie/.neo/workspaces/ws-ylr01iyk/departments/b3718597

# 2. 安装本地 TypeScript 开发环境与基础包
npm install

# 3. 一键编译并启动全套大屏幕演示 (包含 find_skill / 双模式背离检测 / 30日历史回测过程)
npm start
```

### 3.2 动态代币行情调试 (可选)
为了让评委更方便地测试自定义数据，我们的程序支持传入命令行 symbol 参数：
```bash
# 运行 BTC 行情调试
npm run build && node dist/console-ui.js BTC

# 运行 CAKE 行情测试 (展示非白名单时由于行情指标不同产出的不同意图分析)
npm run build && node dist/console-ui.js CAKE
```

---
*Created by BNB Intelligent Trading Department (b3718597). Project Ready for Hackathon Track 2 Submission.*
