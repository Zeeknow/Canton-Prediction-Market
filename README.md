## 📂 Project Structure

```text
.
├── README.md
├── daml
│   └── Main.daml
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.cjs
├── public
│   └── vite.svg
├── src
│   ├── App.tsx
│   ├── assets
│   │   └── react.svg
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```
# 🔮 Canton Prediction Market

# React + TypeScript + Vite

A React-based frontend prototype for the **Canton Hackathon**. This MVP simulates a decentralized prediction market designed to showcase Canton's core privacy features, including sub-transaction privacy and GDPR-compliant redaction.

## 🎯 Hackathon Key Features

This project is a high-fidelity **UI/UX prototype**. The frontend is fully built in React, but the "backend" logic is mocked using `useState` to simulate the user flow.

The UI is designed to explicitly demonstrate two core Canton concepts:

### 1\. 🤫 Sub-Transaction Privacy (The "Blind" Oracle)

  * **The Feature:** The **Oracle Dashboard** is financially blind.
  * **How to See It:** Click the "Oracle" button in the header.
  * **What it Demonstrates:** The UI simulates that the Oracle can *only* see the market question (e.g., "Will ETH pass $4000?") and submit an outcome ("Yes" or "No"). They have no access to who bet, how much was bet, or any financial data. This demonstrates how a real Daml choice would give the Oracle a private, minimal view of the transaction, ensuring their neutrality.

### 2\. ⚖️ GDPR-Compliant Redaction (The "Right to be Forgotten")

  * **The Feature:** The **Market Operator Dashboard** includes an "Archive & Redact" feature.
  * **How to See It:** Click the "Operator" button, find a "resolved" market in the table, and click "Archive & Redact".
  * **What it Demonstrates:** This modal explains a simulated Daml workflow where a `SettledMarket` contract (containing PII like the list of participants) is archived and replaced by a new, `RedactedMarket` contract. This final contract maintains a provable audit trail *without* storing any personal data, demonstrating compliance with data privacy regulations like GDPR.

-----

## 🛠️ Tech Stack

  * **Frontend:** React (built with Vite)
  * **Language:** TypeScript
  * **Styling:** Tailwind CSS
  * **Icons:** Lucide-React

-----

## 🚀 Getting Started (How to Run This Prototype)

This is a standalone frontend prototype and **does not require a Daml ledger** to run.

### 1\. Clone the repository

```bash
git clone [YOUR_GITHUB_REPO_URL_HERE]
cd new-frontend
```

### 2\. Install dependencies

This will install React, Tailwind, and all other necessary packages.

```bash
npm install
```

### 3\. Run the development server

This command starts the app.

```bash
npm run dev
```

Your app will be running at `http://localhost:5173`.

-----

## 🧑‍🔬 How to Use the Prototype

The app is a mock-up with a simple role-switcher at the top of the page. Click the buttons to explore the different user perspectives:

  * **🧑‍💻 Predictor:** The main user view. You can browse markets by category and click "Bet YES" or "Bet NO" to simulate placing a bet.
  * **💼 Operator:** The admin view. You can simulate creating new markets and performing the GDPR-compliant "Archive & Redact" action on markets that the Oracle has resolved.
  * **⚖️ Oracle:** The "blind" data provider. You can only see markets that are "pending resolution" and submit the final outcome.
