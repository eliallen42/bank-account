# Bank Account (React)

A small React single-page app that simulates a simple bank account UI. It demonstrates
local state management with React's useReducer, a transaction history log, and basic
banking operations such as opening an account, deposits, withdrawals (with overdraft),
requesting and paying loans, and closing the account.

This README describes the app's behavior, how to run it locally (Windows / cmd.exe),
and the main files to look at when exploring or extending the project.

## Quick demo

- Start with "Open account" to create an account (initial balance: $500).
- Deposit, Withdraw, Request a loan, Pay a loan, or Close the account using the controls.
- All actions are recorded in the Account History list (up to the most recent 200 entries).

## Features

- Open/close an account (account opens with a starting balance of $500).
- Deposit money (numeric input, cents allowed).
- Withdraw money; withdrawals that cause a negative balance apply a fixed overdraft fee ($25).
- Request a loan (only when no outstanding loan exists).
- Pay a loan (cannot pay more than the outstanding loan or available balance).
- Transaction history with timestamps and before/after balances.

## Live Demo

[View Demo](https://eliallen42.github.io/bank-account)

## Contract (inputs / outputs / error modes)

- Inputs: user clicks/buttons and numeric inputs for amounts (deposit, withdraw, loan, payLoan).
- Outputs: updated UI state (balance, loan amount, account status), and history entries.
- Error / validation behaviors:
  - Deposits/withdrawals/loans ignore non-positive amounts.
  - Withdraw is blocked client-side if the balance is <= 0 and shows an error message.
  - Paying a loan is blocked if the amount exceeds the remaining loan or current balance.
  - Account cannot be closed while loan > 0 or balance !== 0.

## Important implementation details

- State is managed in `src/App.js` using `useReducer` with the following shape:

  {
  balance: number,
  loan: number,
  isActive: boolean,
  overdraftFee: number,
  history: Array<...>,
  accountNumber: string | null,
  lastActionAt: number | null
  }

- The reducer logs every accepted action with a `withLog` helper that stores timestamped
  history entries including `balanceBefore` and `balanceAfter`.
- Initial account opening grants $500 and a generated account number (two 4-digit groups).
- Overdraft fee is currently hard-coded to $25 (see `initialState.overdraftFee`).

## Files of interest

- `src/App.js` — main app and reducer logic (state, actions, logging).
- `src/Controls.js` — UI controls for performing deposit, withdraw, loan requests/payments, and closing the account.
- `src/Header.js` — top header showing account number and balances.
- `src/AccountHistory.js` — renders the transaction history list.
- `public/index.html` and `src/index.js` — standard CRA entry points.

## Run locally (Windows, cmd.exe)

1. Install dependencies

```cmd
npm install
```

2. Run the development server

```cmd
npm start
```

This will open the app at http://localhost:3000 by default.

3. Run tests (CRA default)

```cmd
npm test
```

4. Create a production build

```cmd
npm run build
```

The `build/` directory contains the static production assets.

## Deployment

- The project includes a `deploy` script using `gh-pages`. Ensure `gh-pages` is installed
  (it's in devDependencies) and set the `homepage` field in `package.json` appropriately.

```cmd
npm run build
npm run deploy
```

## Extending / Notes for contributors

- Validation is performed in both `Controls.js` (client-side messages) and in the reducer.
  If you add more actions, update both locations to keep UI and business rules consistent.
- Consider replacing local state with persisted storage (localStorage) or a backend
  if you want state to survive page reloads.
- Tests: add unit tests for the reducer logic (happy path + edge cases such as overdraft,
  loan constraints, closing rules).

## License

This project doesn't include an explicit license file. If you want one, consider adding a
`LICENSE` (MIT, Apache-2.0, etc.).

## Author / Repository

Repository: https://github.com/eliallen42/bank-account

---

If you'd like, I can also add a small unit test for the reducer, wire up basic localStorage
persistence, or add a screenshot and badges to this README. Which would you prefer next?
