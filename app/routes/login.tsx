export function Login() {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="branding">
          <h2>MoneyPilot</h2>
          <span className="brand-chip">Personal Finance Navigator</span>
        </div>
        <p>Track your expenses, investments, and accounts from one place.</p>

        <form id="login-form" className="form-grid" autoComplete="off">
          <div className="field full">
            <label htmlFor="login-email">Email</label>
            <input id="login-email" type="email" required />
          </div>

          <div className="field full">
            <label htmlFor="login-password">Password</label>
            <input id="login-password" type="password" required />
          </div>

          <div className="field full">
            <button className="btn btn-primary" type="submit">
              Login
            </button>
          </div>
        </form>

        <p className="helper">
          New to MoneyPilot?{" "}
          <a href="register">
            <strong>Create an account</strong>
          </a>
          .
        </p>
      </section>
    </main>
  );
}
