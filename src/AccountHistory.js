function labelFor(type) {
  switch (type) {
    case "openAccount":
      return "Account opened";
    case "deposit":
      return "Deposit";
    case "withdraw":
      return "Withdraw";
    case "requestLoan":
      return "Loan requested";
    case "payLoan":
      return "Loan paid";
    case "closeAccount":
      return "Account closed";
    default:
      return type || "Unknown action";
  }
}

function AccountHistory({ history }) {
  const fmt = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  });

  if (history.length === 0) return <p>No account history</p>;

  return (
    <section>
      <h3>Account History</h3>
      <ul>
        {history.map((e) => (
          <li key={e.id}>
            <div>
              <strong>{labelFor(e.type)}</strong>
              {e.amount != null && ` - ${fmt.format(e.amount)}`}
              {e.overdraft && ` - overdraft fee ${fmt.format(e.fee)}`}
            </div>

            <time dateTime={e.at}>{new Date(e.at).toLocaleString()}</time>

            <div>
              Balance: {fmt.format(e.balanceBefore)} →{" "}
              {fmt.format(e.balanceAfter)}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default AccountHistory;
