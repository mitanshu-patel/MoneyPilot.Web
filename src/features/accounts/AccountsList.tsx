import { NavLink, useNavigate } from "react-router";

export function AccountsList() {
  const navigate = useNavigate();
  function logout() {
    localStorage.removeItem("userSession");
    navigate("/login");
  }

  const bankAccounts = [
    { holderName: "John Doe", accountNumber: "123456789", balance: 1000 },
    { holderName: "Jane Smith", accountNumber: "987654321", balance: 2500 },
    // Add more bank accounts as needed
  ];

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="branding">
          <h1>MoneyPilot</h1>
          <span className="brand-chip">Accounts</span>
        </div>
        <div className="actions">
          <span id="active-user" className="helper"></span>
          <button id="logout-btn" className="btn btn-ghost" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <nav className="nav-links">
            <NavLink className="nav-link" data-page="dashboard" to="/">
              Overview
            </NavLink>
            <NavLink className="nav-link" data-page="accounts" to="/accounts">
              Bank Accounts
            </NavLink>
            <NavLink
              className="nav-link"
              data-page="investments"
              to="/investments"
            >
              Investments
            </NavLink>
            <NavLink className="nav-link" data-page="expenses" to="/expenses">
              Expenses
            </NavLink>
          </nav>
        </aside>

        <main className="content">
          <section className="page-title">
            <div>
              <h2>Bank Accounts</h2>
              <p>Manage linked bank accounts.</p>
            </div>
            <NavLink to="/account-add" className="btn btn-primary">
              Add Account
            </NavLink>
          </section>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Holder Name</th>
                  <th>Account Number</th>
                  <th>Balance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="accounts-body">
                {bankAccounts.map((account, index) => (
                  <tr key={index}>
                    <td>{account.holderName}</td>
                    <td>{account.accountNumber}</td>
                    <td>{account.balance}</td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-danger">Edit</button>
                        <button className="btn btn-ghost">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
