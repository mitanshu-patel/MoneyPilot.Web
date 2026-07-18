import { NavLink } from "react-router";

export function Register() {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="branding">
          <h2>MoneyPilot</h2>
          <span className="brand-chip">Start Planning</span>
        </div>
        <p>Create your account using email and password.</p>

        <form id="register-form" className="form-grid" autoComplete="off">
          <div className="field full">
            <label htmlFor="register-email">Email</label>
            <input id="register-email" type="email" required />
          </div>

          <div className="field full">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              type="password"
              minLength={6}
              required
            />
          </div>

          <div className="field full">
            <button className="btn btn-primary" type="submit">
              Register
            </button>
          </div>
        </form>

        <p className="helper">
          Already have an account?{" "}
          <NavLink to="/login">
            <strong>Go to login</strong>
          </NavLink>
          .
        </p>
      </section>
    </main>
  );
}
