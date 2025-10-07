import { useMemo } from "react";

function Header({ isActive, accountNumber, balance, loan }) {
  const fmt = useMemo(
    () =>
      new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }),
    []
  );

  return (
    <header>
      <h1>Account {isActive ? accountNumber : "Inactive"}</h1>
      <p>
        Balance: {fmt.format(balance)} | Loan: {fmt.format(loan)}
      </p>
    </header>
  );
}

export default Header;
