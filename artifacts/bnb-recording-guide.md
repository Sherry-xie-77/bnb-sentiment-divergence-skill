# BNB HACK (AI Trading Agent Edition): ≤3分钟 视频录屏分镜与操作脚本

本指南旨在指导团队如何录制一段符合 DoraHacks 提报规范、效果酷炫、逻辑流畅的 **≤3分钟 Demo 讲解视频**。由于我们参与的是 **Track 2 (Strategy Skills)** 赛道，演示的重点是**信号的生成逻辑、意图路由的精准度以及历史策略回测的高胜率表现**，无需展示真实的链上交易 Swap 广播。

---

## 一、 录屏前期准备 (Recording Setup)

1.  **终端设置：** 
    - 使用支持 ANSI 彩色高亮的终端（如 VS Code 终端、iTerm2、macOS Terminal）。
    - 建议使用暗色背景（Dark Theme），将字体稍微放大，使文字对比鲜明、易于阅读。
    - 清空多余的终端历史记录。
2.  **录屏软件：** 
    - 使用 OBS Studio、Loom、macOS QuickTime Player 或其他录屏工具。
    - 选择“录制特定窗口”或裁剪多余的桌面元素，仅保留终端运行界面，保持极致专业度。
3.  **运行热身：** 
    - 录制前确保依赖包已完全安装，并在本地试跑 `npm start`，确保流畅无卡顿。

---

## 二、 录屏分镜与旁白脚本 (Storyboard & Voiceover Script)

### 🎬 第一阶段：赛事切入与系统初始化 (0:00 - 0:35)
*   **画面动作：** 
    - 屏幕展示干净的暗色终端，输入并敲击指令：`npm start`。
    - 屏幕上流式打印出 `TRUST-SHIELD AI: MULTI-PROOF INTENT AUDITING & SENTINEL SHIELD`（或我们的最新主屏 `BNB HACK TRACK 2: SENTIMENT DIVERGENCE ARBITRAGE SIGNAL SKILL DEMO`）酷炫的 ANSI 大字符主标。
    - 紧接着自动进入 `[System Initialization] Spawning Sentiment Signal Skill Engines...` 进度加载。
*   **操作配合：** 敲击回车，让系统保持流式加载进度。
*   **英文解说旁白 (Voiceover)：**
    > "Hello, judges and Web3 builders! Welcome to our project presentation for BNB Hack: AI Trading Agent Edition. We present the **Sentiment Divergence Signal Skill**, a specialized AI Agent Skill built on top of CoinMarketCap’s AI Agent Hub and Technical Indicators, designed specifically to capture profitable arbitrage opportunities at market tops and bottoms."

---

### 🎬 第二阶段：find_skill 智能自然语言意图匹配 (0:35 - 1:10)
*   **画面动作：** 
    - 屏幕自动滚动并展现 `>>> STAGE 1: Testing "find_skill" Natural Language Intent Routing <<<`。
    - 展现对三个测试自然语言 Prompts 的自动解析与置信度打分过程。
    - 观众可以看到 "Give me the sentiment divergence signal for BNB right now" 被成功匹配为 TRUE，意图捕获为 `SENTIMENT_DIVERGENCE_ARBITRAGE_ANALYSIS`，置信度高达 `95%`！
    - 中文 Query 也被完美识别；不相关的 Query 被判定为 FALSE (Confidence 10%)。
*   **操作配合：** 鼠标可以轻微滑动，聚焦/圈选终端中输出的 `Matched: TRUE` 和 `Confidence: 95%` 部分，加强视觉关注度。
*   **英文解说旁白 (Voiceover)：**
    > "Track 2 requires a robust intent routing capability. As demonstrated in Stage 1, our module exposes the native `find_skill` routing interface. Whether the user inputs 'Give me the sentiment divergence signal for BNB' in English or inquires about divergence in Chinese, our cognitive parser instantly routes the query with up to 95% confidence, while safely rejecting irrelevant queries."

---

### 🎬 第三阶段：Scenario A 情绪顶背离警报（做空信号） (1:10 - 1:50)
*   **画面动作：**
    - 屏幕向下滚动至 `>>> STAGE 2: Running Real-Time Scan - Scenario A: Bearish Top Divergence <<<`。
    - 流式输出 BNB 行情指标数据：社交热度极热（96/100 FOMO）、极度贪婪（Fear & Greed Index: 85）、RSI 超买 (78.5)。
    - **核心背离：** On-chain 大额资金正在大额撤退（-$12.5M USD 净流出），散户高多空持仓比（1.58）。
    - 信号引擎判定背离，生成红色的 🔴 **SELL** 信号与详细的熊市套利分析理由（Rationale）。
*   **操作配合：** 鼠标在 `Divergence Pattern: BEARISH_TOP_DIVERGENCE` 以及 Rationale 日志上滑动，聚焦“散户狂热、聪明钱逃亡”的经典背离逻辑。
*   **英文解说旁白 (Voiceover)：**
    > "In Stage 2, we simulate a parabolic market peak for BNB. Social hype is extremely over-FOMO at 96 out of 100, and RSI is heavily overbought. However, our CoinMarketCap big wallet tracker reveals that Smart Money is quietly distributing, with over $12.5 million dollars in net outflows. Identifying this classic retail FOMO vs. Whale distribution pattern, our engine triggers a strong Bearish Top Divergence alert and generates an instant 🔴 **SELL** signal to preserve capital and initiate high-probability short-arbitrage."

---

### 🎬 第四阶段：Scenario B 情绪底背离警报（买入抄底） (1:50 - 2:25)
*   **画面动作：**
    - 屏幕滚动至 `>>> STAGE 3: Running Real-Time Scan - Scenario B: Bullish Bottom Divergence <<<`。
    - 展现 BNB 跌入深谷 $412.10，RSI 极低 21.3 (深超卖)。社交热度惨淡仅 12，全网 Extreme Fear (16)。
    - **核心背离：** 聪明钱开始绝地吸筹（净流入 +$18.5M USD）。
    - 信号引擎判定背离，生成绿色的 🟢 **BUY** 信号和牛市抄底理由（Rationale）。
*   **操作配合：** 聚焦 `recommendedAction: BUY` 绿字高亮处。
*   **英文解说旁白 (Voiceover)：**
    > "Conversely, Stage 3 scans a market capitulation bottom. Retail traders are in absolute panic, with the Fear & Greed index plummeting to 16, and BNB oversold with RSI at 21. Yet, on-chain smart money is entering massively with $18.5 million in net inflows. Our skill immediately flags a Bullish Bottom Divergence and issues a 🟢 **BUY** signal. It catches the bottom right before a major short-squeeze, illustrating the pure power of multi-dimensional arbitrage."

---

### 🎬 第五阶段：30天历史回测及盈利总结 (2:25 - 3:00)
*   **画面动作：**
    - 屏幕滚动至 `>>> STAGE 4: Executing Multi-Metric 30-Day Historical Strategy Backtest <<<`。
    - 看到 Day 01 至 Day 30 的价格波动、交易动作、背离形态发现、以及个人资产（Portfolio Value）每日滚动的动画。
    - 紧接着展现 `HISTORICAL BACKTEST SUMMARY REPORT` 结算看板：
        - 初始本金: $10,000.00 USD -> 最终本金: $10,893.41 USD。
        - 累计收益率 (Total Return): **+8.93%**。
        - 交易胜率 (Win Rate): **100.00%**！
        - 最大资金回撤 (Max Drawdown): 9.11%。
    - 最终输出亮绿色大字：`🌟 STRATEGY EVALUATION RUN SUCCESSFULLY COMPLETED AND SHIPPED!`
*   **操作配合：** 将画面停留在 Summary Report，让评委看清 100% 胜率和总回报。
*   **英文解说旁白 (Voiceover)：**
    > "In Stage 4, we run a rigorous 30-day backtest simulating a full market cycle: range, pump, top-distribution, dump, capitulation, and recovery. Under realistic constraints including a 0.2% slippage and trading fee friction, our strategy successfully processed 4 signals, capturing 100% winning trades. The portfolio grew from $10,000 to over $10,893—yielding a solid 8.93% cumulative return with a safe maximum drawdown. Sentiment-Divergence makes AI trading not only smart, but quantitatively verifiable. Thank you for watching, and let's build the future on BNB Chain!"

---

## 三、 视频后期剪辑建议

1.  **视频加速：** 在 Stage 4 跑 30 日每日回测日志时，可进行 1.5 倍速快速通过，使视频节奏更紧凑，确保总长度严格控制在 **2分45秒 至 3分钟** 之间。
2.  **音轨处理：** 使用清晰、无杂音的话筒录制人声配音。可以加入轻快、科技感的低音背景音乐（如 Deep House 或 Lo-Fi Beats），但注意背景音乐音量不可盖过人声（人声 -6dB，音乐 -25dB）。
3.  **转场：** 无需复杂的特效转场，直接对终端窗口录屏即可，保持程序员极客硬核、纯粹的黑客松交付风格。
