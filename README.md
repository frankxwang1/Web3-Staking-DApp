# 🚀 Web3 Staking DApp

---

## 📖 项目介绍

**Web3-Staking-DApp** 是一个基于以太坊的去中心化质押平台。该项目实现了经典的 **Synthetix 质押算法**，确保收益分配的公平性与实时性。

- **合约端**：采用 Solidity 开发，支持 ERC20 资产质押、按秒计息、重入保护。
- **前端端**：基于 Next.js 14 开发，使用 Wagmi v2 处理链上交互，响应式 UI 适配移动端。

---

## ✨ 核心功能

- [x] 🦊 **钱包连接** - 支持浏览器插件钱包（MetaMask 等），实时显示缩略地址。
- [x] 📊 **资产仪表盘** - 自动读取链上余额、已质押量及待领取收益，支持 5s 自动刷新。
- [x] 📥 **质押 (Stake)** - 支持输入任意金额质押，包含精度处理，实时反馈交易状态。
- [x] 📤 **赎回 (Withdraw)** - 随时提取本金，操作实时同步，包含安全确认逻辑。
- [x] 💰 **收益领取 (Claim)** - 5秒自动刷新收益，支持一键领取到账。
- [x] 🛡️ **安全增强** - 合约集成 OpenZeppelin，支持 ReentrancyGuard 防重入保护及 SafeERC20 安全转账。
- [x] 🚥 **交互反馈** - 完整实现 Loading 状态、Pending 提示、成功/失败 Toast 提醒。

---

## 📂 项目结构

```text
├── contracts/          # 智能合约 (Solidity)
│   ├── Staking.sol     # 核心质押合约 (Synthetix 模型 + OpenZeppelin + 防重入)
│   └── MockERC20.sol   # 测试用 ERC20 代币
└── frontend/           # 前端应用 (Next.js 14)
    ├── app/            # 页面路由 (Home & Staking)
    ├── components/     # UI 组件 (带 Loading/Pending 状态反馈)
    ├── hooks/          # 自定义 Wagmi 钩子
    ├── lib/            # Wagmi 配置 (v2) 与常量
    └── abi/            # 合约 ABI 文件 (包含事件日志定义)
```

---

## 🛠️ 技术栈

- **智能合约**: Solidity, OpenZeppelin
- **前端框架**: Next.js 14 (App Router)
- **Web3 库**: Wagmi v2, Viem
- **样式**: Tailwind CSS
- **状态管理**: React Query (TanStack Query)

---

## 🚀 快速启动

### 1. 克隆项目
```bash
git clone https://github.com/your-username/Web3-Staking-DApp.git
cd Web3-Staking-DApp

# 安装合约依赖
npm install
```

### 2. 前端配置与启动
> **重要**：在打开代码编辑器前，请确保已安装项目依赖，否则编辑器可能会报 `JSX element implicitly has type 'any'` 等类型错误。

```bash
cd frontend

# 安装依赖 (必须执行)
yarn install

# 安装 IDE SDKs (解决 PnP 模式下的类型报错)
yarn dlx @yarnpkg/sdks vscode
```

**IDE 配置建议**：
1. 打开 `frontend` 目录下的任意 `.ts` 或 `.tsx` 文件。
2. 点击右下角的 TypeScript 版本号，或使用快捷键 `Cmd+Shift+P` (Mac) 搜索 **"Select TypeScript Version"**。
3. 选择 **"Use Workspace Version"**。这将启用 Yarn PnP 模式下的类型识别。

# 配置环境变量

- 创建 .env.local 并填入以下内容：
- NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS=你的合约地址
- NEXT_PUBLIC_WCM_PROJECT_ID=你的WalletConnect项目ID

# 启动开发服务器
```bash
npm run dev
```
打开 [http://localhost:3000/staking](http://localhost:3000/staking) 访问质押页面。

---

## 📄 合约说明

| 合约名称 | 功能描述 | 状态 |
| :--- | :--- | :--- |
| **Staking** | 核心逻辑：质押、赎回、奖励计算 | ✅ 已实现 |
| **MockERC20** | 测试代币：用于在测试网模拟资产 | ✅ 已实现 |

---

## 📸 预览图

> *预览图展示*

![Dashboard Preview](https://i.mji.rip/2026/04/29/a27dae67d18c75c4a867f62df92a60b3.png)

---

## 🛡️ 许可证

根据 [MIT License](LICENSE) 许可。
