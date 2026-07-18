export default function Home() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="app-shell" id="dashboard-root">
        <header className="topbar">
          <div className="branding">
            <h1>MoneyPilot</h1>
            <span className="brand-chip">Dashboard</span>
          </div>
          <div className="actions">
            <span id="active-user" className="helper"></span>
            <button id="logout-btn" className="btn btn-ghost">
              Logout
            </button>
          </div>
        </header>

        <div className="layout">
          <aside className="sidebar">
            <nav className="nav-links">
              <a className="nav-link" data-page="dashboard" href="dashboard">
                Overview
              </a>
              <a className="nav-link" data-page="accounts" href="accounts">
                Bank Accounts
              </a>
              <a
                className="nav-link"
                data-page="investments"
                href="investments"
              >
                Investments
              </a>
              <a className="nav-link" data-page="expenses" href="expenses">
                Expenses
              </a>
            </nav>
          </aside>

          <main className="content">
            <section className="page-title">
              <div>
                <h2>Finance Overview</h2>
                <p>Income vs expenses and investment metrics.</p>
              </div>
            </section>

            <section className="stats">
              <article className="stat">
                Available Balance
                <strong id="stat-income">-</strong>
              </article>
              <article className="stat">
                Monthly Expenses
                <strong id="stat-expenses">-</strong>
              </article>
              <article className="stat">
                Monthly Investments
                <strong id="stat-investments">-</strong>
              </article>
            </section>

            <section className="card control-card">
              <div className="page-title" style={{ marginBottom: "10px" }}>
                <div>
                  <h3>Budget Management By Category</h3>
                  <p>
                    Track category spend using balance, investments, and
                    expenses.
                  </p>
                </div>
              </div>
              <form id="income-form" className="form-grid" autoComplete="off">
                <div className="field">
                  <label htmlFor="monthly-liabilities">Liabilities</label>
                  <input
                    id="monthly-liabilities"
                    type="number"
                    min="0"
                    required
                  />
                </div>
                <div className="field full">
                  <button type="submit" className="btn btn-primary">
                    Save Liabilities
                  </button>
                </div>
              </form>
              <div className="budget-list" id="budget-category-list"></div>
            </section>

            <section className="card chart-card">
              <div className="page-title" style={{ marginBottom: "10px" }}>
                <div>
                  <h3>Monthly Metrics Chart</h3>
                  <p>
                    Visual split of expenses, investments, and remaining
                    balance.
                  </p>
                </div>
              </div>
              <div className="chart-wrap">
                <canvas
                  id="dashboard-metrics-chart"
                  aria-label="Monthly financial metrics chart"
                ></canvas>
              </div>
            </section>

            <section className="stats">
              <article className="stat">
                Net Worth (Assets - Liabilities)
                <strong id="stat-net-worth">-</strong>
              </article>
              <article className="stat">
                Total Assets
                <strong id="stat-total-assets">-</strong>
              </article>
              <article className="stat">
                Profit / Loss
                <strong id="stat-profit-loss">-</strong>
              </article>
            </section>

            <section className="card chart-card">
              <div className="page-title" style={{ marginBottom: "10px" }}>
                <div>
                  <h3>Asset Allocation Charts</h3>
                  <p>
                    Current portfolio distribution across cash, investments, and
                    liabilities.
                  </p>
                </div>
              </div>
              <div className="chart-wrap">
                <canvas
                  id="asset-allocation-chart"
                  aria-label="Asset allocation chart"
                ></canvas>
              </div>
            </section>

            <section className="card">
              <h3>Portfolio Dashboard</h3>
              <div className="stats compact-stats">
                <article className="stat">
                  Cash Allocation
                  <strong id="portfolio-cash-share">-</strong>
                </article>
                <article className="stat">
                  Investment Allocation
                  <strong id="portfolio-investment-share">-</strong>
                </article>
                <article className="stat">
                  Liability Pressure
                  <strong id="portfolio-liability-share">-</strong>
                </article>
              </div>

              <h3>
                Total Linked Account Balance:{" "}
                <span id="dashboard-balance">-</span>
              </h3>
              <div className="meter">
                <div className="legend">
                  <span>Budget Use</span>
                  <span id="budget-percent">0%</span>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    id="budget-fill"
                    style={{ width: "0%" }}
                  ></div>
                </div>
              </div>

              <div className="notice">
                AI Insight Channel (via backend API):
                <div id="insight-text"></div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </main>
  );
}
