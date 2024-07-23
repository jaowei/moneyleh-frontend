# MoneyLeh

## Offline First Personal Finances Tracker

The main motivation for this project is as follows:

- Gain exposure to offline first web applications
- Gain exposure to a signals based framework like [SolidJS](https://www.solidjs.com/)
- Automate personal finances tracking for me and my friends

> View the current version [here](https://moneyleh-frontend.pages.dev/)

Technology Stack:

1. Frontend framework: SolidJS
2. Build Tool: Vite
3. Styling: TailwindCSS + UnoCSS
4. Persistence: SQLite WASM

## Features

1. Add accounts and transactions to them for tracking
2. Add transactions easily with easy conversion of financial statements of common Singaporean financial institutions into a unified data structure saved to SQLite database
   - File formats supported: PDF, CSV, XLS
   - List of companies: DBS, UOB, Syfe, Interactive Brokers, MooMoo, HSBC
3. Tag transactions to create a personalised view of your spending, for better analysis
4. TODO: Dashboards and visualisations
5. TODO: Auto tagging of transactions
6. TODO: Credit card points/cashback verification
7. TODO: Insurance coverage calculator
8. TODO: Budgeting and loan calculator

## How to run

> Pre-requisites: `pnpm >=9`, `node >= 18`

1. Clone the repository
2. `cd moneyleh-frontend`
3. `pnpm install`
   - If you are installing for the first time also run `pnpm run build` to copy some assets required
4. `pnpm run dev` and view at localhost:5173, as configured with vite
