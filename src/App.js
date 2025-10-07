import { useReducer } from "react";
import Header from "./Header";
import Controls from "./Controls";
import AccountHistory from "./AccountHistory";
import "./styles.css";

const initialState = {
  balance: 0,
  loan: 0,
  isActive: false,
  overdraftFee: 25,
  history: [],
  accountNumber: null,
  lastActionAt: null,
};

function withLog(prev, next, entry) {
  const log = {
    id: Date.now() + Math.random(),
    at: new Date().toISOString(),
    ...entry,
    balanceBefore: prev.balance,
    balanceAfter: next.balance,
  };
  return {
    ...next,
    history: [log, ...prev.history].slice(0, 200),
    lastActionAt: Date.now(),
  };
}

function reducer(state, action) {
  if (!state.isActive && action.type !== "openAccount") return state;

  switch (action.type) {
    case "openAccount": {
      if (state.isActive) return state;
      const next = {
        ...state,
        isActive: true,
        balance: 500,
        accountNumber: action.accountNumber,
      };
      return withLog(state, next, { type: "openAccount" });
    }

    case "deposit": {
      const amt = Number(action.amount) || 0;
      if (amt <= 0) return state;
      const next = { ...state, balance: state.balance + amt };
      return withLog(state, next, { type: "deposit", amount: amt });
    }

    case "withdraw": {
      const amt = Number(action.amount) || 0;
      if (amt <= 0 || state.balance <= 0) return state;
      const overdraft = state.balance - amt < 0;
      const fee = overdraft ? state.overdraftFee : 0;
      const next = { ...state, balance: state.balance - amt - fee };
      return withLog(state, next, {
        type: "withdraw",
        amount: amt,
        overdraft,
        fee,
      });
    }

    case "requestLoan": {
      const amt = Number(action.amount) || 0;
      if (state.loan > 0 || amt <= 0) return state;
      const next = { ...state, balance: state.balance + amt, loan: amt };
      return withLog(state, next, { type: "requestLoan", amount: amt });
    }

    case "payLoan": {
      const amt = Math.max(0, Number(action.amount) || 0);
      if (state.loan === 0 || amt === 0 || state.balance === 0) return state;

      if (amt > state.loan || amt > state.balance) return state;

      const next = {
        ...state,
        balance: state.balance - amt,
        loan: state.loan - amt,
      };
      return withLog(state, next, { type: "payLoan", amount: amt });
    }

    case "closeAccount": {
      if (state.loan > 0 || state.balance !== 0) return state;
      const closed = withLog(state, state, { type: "closeAccount" });
      return {
        ...initialState,
        history: closed.history,
        lastActionAt: Date.now(),
      };
    }

    default:
      return state;
  }
}

export default function App() {
  const [
    { balance, loan, isActive, history, accountNumber, lastActionAt },
    dispatch,
  ] = useReducer(reducer, initialState);

  return (
    <div className="App">
      <Header
        isActive={isActive}
        accountNumber={accountNumber}
        balance={balance}
        loan={loan}
      />

      <Controls
        isActive={isActive}
        balance={balance}
        loan={loan}
        lastActionAt={lastActionAt}
        dispatch={dispatch}
      />

      <p className="note">*Overdraft fee: $25</p>
      <AccountHistory history={history} />
    </div>
  );
}
