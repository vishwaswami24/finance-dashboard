import { formatDate } from "../utils.js";

export function UsersSection({
  userForm,
  setUserForm,
  onSubmitUser,
  users,
  userDrafts,
  setUserDrafts,
  onSaveUser
}) {
  return (
    <section className="split-grid section-grid" id="users">
      <form className="panel" onSubmit={onSubmitUser}>
        <div className="section-head">
          <div>
            <h2>Create User</h2>
            <p>Admins manage user roles and can deactivate accounts instead of hard deleting them.</p>
          </div>
        </div>

        <label>
          Name
          <input
            value={userForm.name}
            onChange={(event) =>
              setUserForm((current) => ({ ...current, name: event.target.value }))
            }
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={userForm.email}
            onChange={(event) =>
              setUserForm((current) => ({ ...current, email: event.target.value }))
            }
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={userForm.password}
            onChange={(event) =>
              setUserForm((current) => ({ ...current, password: event.target.value }))
            }
          />
        </label>

        <label>
          Role
          <select
            value={userForm.role}
            onChange={(event) =>
              setUserForm((current) => ({ ...current, role: event.target.value }))
            }
          >
            <option value="viewer">Viewer</option>
            <option value="analyst">Analyst</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <label>
          Status
          <select
            value={userForm.status}
            onChange={(event) =>
              setUserForm((current) => ({ ...current, status: event.target.value }))
            }
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>

        <button className="button button--primary" type="submit">
          Create User
        </button>
      </form>

      <section className="panel">
        <div className="section-head">
          <div>
            <h2>User Access Matrix</h2>
            <p>Change role or status and the backend immediately enforces the updated permissions.</p>
          </div>
        </div>

        {users.length ? (
          <div className="user-matrix">
            {users.map((user) => {
              const roleValue = userDrafts[user.id]?.role || user.role;
              const statusValue = userDrafts[user.id]?.status || user.status;

              return (
                <article className="user-card" key={user.id}>
                  <div className="user-card__top">
                    <div className="user-card__identity">
                      <div className="user-avatar" aria-hidden="true">
                        {user.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>

                      <div className="user-card__copy">
                        <strong>{user.name}</strong>
                        <span>{user.email}</span>
                      </div>
                    </div>

                    <div className="user-card__meta">
                      <span className={`badge badge--${roleValue}`}>{roleValue}</span>
                      <span className={`status-pill status-pill--${statusValue}`}>{statusValue}</span>
                    </div>
                  </div>

                  <div className="user-card__controls">
                    <label className="inline-field">
                      <span>Role</span>
                      <select
                        value={roleValue}
                        onChange={(event) =>
                          setUserDrafts((current) => ({
                            ...current,
                            [user.id]: {
                              ...current[user.id],
                              role: event.target.value
                            }
                          }))
                        }
                      >
                        <option value="viewer">Viewer</option>
                        <option value="analyst">Analyst</option>
                        <option value="admin">Admin</option>
                      </select>
                    </label>

                    <label className="inline-field">
                      <span>Status</span>
                      <select
                        value={statusValue}
                        onChange={(event) =>
                          setUserDrafts((current) => ({
                            ...current,
                            [user.id]: {
                              ...current[user.id],
                              status: event.target.value
                            }
                          }))
                        }
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </label>
                  </div>

                  <div className="user-card__footer">
                    <span>Last login {formatDate(user.lastLogin)}</span>
                    <button
                      className="button button--ghost button--small"
                      type="button"
                      onClick={() => onSaveUser(user.id)}
                    >
                      Save access
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="empty-state">No managed users found.</p>
        )}
      </section>
    </section>
  );
}
