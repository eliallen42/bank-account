import { useEffect, useState } from "react";

function makeAccountNumber() {
  const part = () => String(Math.floor(1000 + Math.random() * 9000));
  return `${part()}-${part()}`;
}

function Controls({ isActive, balance, loan, lastActionAt, dispatch }) {
  const [deposit, setDeposit] = useState(0);
  const [withdraw, setWithdraw] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0);
  const [payLoan, setPayLoan] = useState(0);

  const [withdrawError, setWithdrawError] = useState("");
  const [payLoanError, setPayLoanError] = useState("");

  useEffect(() => {
    if (lastActionAt) {
      setWithdrawError("");
      setPayLoanError("");
    }
  }, [lastActionAt]);

  return (
    <div className="App">
      <p>
        <button
          onClick={() =>
            dispatch({
              type: "openAccount",
              accountNumber: makeAccountNumber(),
            })
          }
          disabled={isActive}
        >
          Open account
        </button>
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          dispatch({ type: "deposit", amount: deposit });
          setDeposit(0);
        }}
      >
        <button type="submit" disabled={!isActive}>
          Deposit
        </button>
        <input
          type="number"
          min="0"
          step={"0.01"}
          value={deposit}
          onChange={(e) => setDeposit(Number(e.target.value))}
          onFocus={(e) => e.target.select()}
          disabled={!isActive}
        />
      </form>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (balance <= 0) {
            setWithdrawError("Insufficient funds for withdrawal");
            return;
          }

          dispatch({ type: "withdraw", amount: withdraw });
          setWithdraw(0);
          setWithdrawError("");
        }}
      >
        <button type="submit" disabled={!isActive}>
          Withdraw
        </button>
        <input
          type="number"
          min="0"
          step={"0.01"}
          value={withdraw}
          onChange={(e) => {
            setWithdraw(Number(e.target.value));
            setWithdrawError("");
          }}
          onFocus={(e) => {
            e.target.select();
            setWithdrawError("");
          }}
          disabled={!isActive}
        />
        {withdrawError && (
          <div style={{ color: "red", fontSize: "0.8em" }}>{withdrawError}</div>
        )}
      </form>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          dispatch({ type: "requestLoan", amount: loanAmount });
          setLoanAmount(0);
        }}
      >
        <button type="submit" disabled={!isActive || loan > 0}>
          Request a loan
        </button>
        <input
          type="number"
          min="0"
          step={"0.01"}
          value={loanAmount}
          onChange={(e) => setLoanAmount(Number(e.target.value))}
          onFocus={(e) => e.target.select()}
          disabled={!isActive || loan > 0}
        />
      </form>

      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (payLoan > loan) {
            setPayLoanError("Amount exceeds remaining loan");
            return;
          }

          if (payLoan > balance) {
            setPayLoanError("Amount exceeds current balance");
            return;
          }

          dispatch({ type: "payLoan", amount: payLoan });
          setPayLoan(0);
          setPayLoanError("");
        }}
      >
        <button type="submit" disabled={!isActive || loan === 0}>
          Pay loan
        </button>
        <input
          type="number"
          min="0"
          step={"0.01"}
          value={payLoan}
          onChange={(e) => {
            setPayLoan(Number(e.target.value));
            setPayLoanError("");
          }}
          onFocus={(e) => {
            e.target.select();
            setPayLoanError("");
          }}
          disabled={!isActive || loan === 0}
        />
        {payLoanError && (
          <div style={{ color: "red", fontSize: "0.8em" }}>{payLoanError}</div>
        )}
      </form>

      <p>
        <button
          onClick={() => dispatch({ type: "closeAccount" })}
          disabled={!isActive || loan > 0 || balance !== 0}
        >
          Close account
        </button>
      </p>
    </div>
  );
}

export default Controls;
