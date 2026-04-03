import { defaultAuthForm, roleDescriptions } from "../utils.js";

export function AuthView({ authForm, setAuthForm, onSubmit, loading }) {
  return (
    <section className="split-grid section-grid" id="access">
      <form className="panel auth-card" onSubmit={onSubmit}>
        <div className="section-head">
          <div>
            <h2>Sign In</h2>
            <p>Authenticate with the seeded admin account, then create analyst and viewer users.</p>
          </div>
        </div>

        <label>
          Email
          <input
            type="email"
            value={authForm.email}
            onChange={(event) =>
              setAuthForm((current) => ({ ...current, email: event.target.value }))
            }
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={authForm.password}
            onChange={(event) =>
              setAuthForm((current) => ({ ...current, password: event.target.value }))
            }
          />
        </label>

        <button className="button button--primary" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Access Dashboard"}
        </button>
      </form>

      <div className="panel role-card">
        <div className="section-head">
          <div>
            <h2>Role Model</h2>
            <p>The interface mirrors the backend guard behavior so each role sees the right surface area.</p>
          </div>
        </div>

        <div className="role-list">
          {Object.entries(roleDescriptions).map(([role, description]) => (
            <article className="role-tile" key={role}>
              <strong>{role}</strong>
              <p>{description}</p>
            </article>
          ))}
        </div>

        <div className="seed-hint">
          <span>Seeded admin</span>
          <strong>{defaultAuthForm.email}</strong>
          <span>{defaultAuthForm.password}</span>
        </div>
      </div>
    </section>
  );
}
