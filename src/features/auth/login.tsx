import { NavLink, useNavigate } from "react-router";
import type { SessionInfo } from "../../types/SessionInfo";
import { authenticate } from "../../api/auth/auth-service";

export function Login() {
  const navigate = useNavigate();

  function login(f: React.SubmitEvent<HTMLFormElement>) {
    debugger;
    f.preventDefault();
    const form = f.target;
    const formData = new FormData(form as HTMLFormElement);
    const email = formData.get("email");
    const password = formData.get("password");

    authenticate(email as string, password as string)
      .then((data) => {
        const token = data.Token;
        const session = { Email: email as string, Token: token } as SessionInfo;
        localStorage.setItem("userSession", JSON.stringify(session));
        navigate("/");
      })
      .catch((error) => {
        console.error("Login error:", error);
      });
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="branding">
          <h2>MoneyPilot</h2>
          <span className="brand-chip">Personal Finance Navigator</span>
        </div>
        <p>Track your expenses, investments, and accounts from one place.</p>

        <form onSubmit={login} className="form-grid" autoComplete="off">
          <div className="field full">
            <label htmlFor="login-email">Email</label>
            <input id="login-email" name="email" type="email" required />
          </div>

          <div className="field full">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              required
            />
          </div>

          <div className="field full">
            <button className="btn btn-primary" type="submit">
              Login
            </button>
          </div>
        </form>

        <p className="helper">
          New to MoneyPilot?{" "}
          <NavLink to="/sign-up">
            <strong>Create an account</strong>
          </NavLink>
          .
        </p>
      </section>
    </main>
  );
}
