import { useEffect, useState } from "react";
import { apiRequest } from "./api.js";
import { AuthView } from "./components/AuthView.jsx";
import { DashboardSection } from "./components/DashboardSection.jsx";
import { RecordsSection } from "./components/RecordsSection.jsx";
import { UsersSection } from "./components/UsersSection.jsx";
import {
  buildQuery,
  createEmptyRecordForm,
  createEmptyUserForm,
  defaultAuthForm,
  defaultFilters,
  formatDate,
  getErrorMessage,
  toInputDate
} from "./utils.js";

const capabilityChips = [
  "Role Policy Engine",
  "Real-Time Processing",
  "Protected Records",
  "Summary Intelligence"
];

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("finance-token") || "");
  const [currentUser, setCurrentUser] = useState(null);
  const [authForm, setAuthForm] = useState(defaultAuthForm);
  const [filters, setFilters] = useState(defaultFilters);
  const [recordForm, setRecordForm] = useState(createEmptyRecordForm);
  const [userForm, setUserForm] = useState(createEmptyUserForm);
  const [dashboard, setDashboard] = useState(null);
  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [users, setUsers] = useState([]);
  const [userDrafts, setUserDrafts] = useState({});
  const [editingRecordId, setEditingRecordId] = useState("");
  const [recordPage, setRecordPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState({ type: "", text: "" });

  const isAdmin = currentUser?.role === "admin";
  const canViewRecords = currentUser?.role === "admin" || currentUser?.role === "analyst";
  const dashboardQuery = buildQuery(filters);
  const recordsQuery = buildQuery({ ...filters, page: recordPage, limit: 12 });
  useEffect(() => {
    if (!token || currentUser) {
      return;
    }

    let cancelled = false;

    async function restoreSession() {
      try {
        const data = await apiRequest("/auth/me", { token });
        if (!cancelled) {
          setCurrentUser(data.user);
        }
      } catch (error) {
        if (!cancelled) {
          clearSession();
          setBanner({ type: "error", text: getErrorMessage(error) });
        }
      }
    }

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, [token, currentUser]);

  useEffect(() => {
    if (!token || !currentUser) {
      return;
    }

    let cancelled = false;

    async function loadData() {
      setLoading(true);

      try {
        const [dashboardData, recordData, userData] = await Promise.all([
          apiRequest(`/dashboard${dashboardQuery ? `?${dashboardQuery}` : ""}`, { token }),
          canViewRecords
            ? apiRequest(`/records${recordsQuery ? `?${recordsQuery}` : ""}`, { token })
            : Promise.resolve(null),
          isAdmin ? apiRequest("/users", { token }) : Promise.resolve(null)
        ]);

        if (cancelled) {
          return;
        }

        setDashboard(dashboardData);
        setRecords(recordData?.records ?? []);
        setPagination(recordData?.pagination ?? null);
        setUsers(userData?.users ?? []);
        setUserDrafts(
          Object.fromEntries(
            (userData?.users ?? []).map((user) => [
              user.id,
              {
                role: user.role,
                status: user.status
              }
            ])
          )
        );
      } catch (error) {
        if (!cancelled) {
          if (error.message.toLowerCase().includes("authentication")) {
            clearSession();
          }
          setBanner({ type: "error", text: getErrorMessage(error) });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [token, currentUser, canViewRecords, isAdmin, dashboardQuery, recordsQuery, refreshKey]);

  function clearSession() {
    localStorage.removeItem("finance-token");
    setToken("");
    setCurrentUser(null);
    setDashboard(null);
    setRecords([]);
    setPagination(null);
    setUsers([]);
    setUserDrafts({});
  }

  function bumpRefresh() {
    setRefreshKey((value) => value + 1);
  }

  function resetRecordForm() {
    setEditingRecordId("");
    setRecordForm(createEmptyRecordForm());
  }

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: authForm
      });

      localStorage.setItem("finance-token", data.token);
      setToken(data.token);
      setCurrentUser(data.user);
      setBanner({ type: "success", text: `Signed in as ${data.user.role}.` });
    } catch (error) {
      setBanner({ type: "error", text: getErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    clearSession();
    setBanner({ type: "success", text: "Session closed." });
  }

  async function handleRecordSubmit(event) {
    event.preventDefault();

    try {
      const path = editingRecordId ? `/records/${editingRecordId}` : "/records";
      const method = editingRecordId ? "PATCH" : "POST";
      const data = await apiRequest(path, { method, token, body: recordForm });

      setBanner({ type: "success", text: data.message });
      resetRecordForm();
      setRecordPage(1);
      bumpRefresh();
    } catch (error) {
      setBanner({ type: "error", text: getErrorMessage(error) });
    }
  }

  function handleEditRecord(record) {
    setEditingRecordId(record.id);
    setRecordForm({
      amount: String(record.amount),
      type: record.type,
      category: record.category,
      occurredAt: toInputDate(record.occurredAt),
      notes: record.notes || ""
    });
    setBanner({ type: "", text: "" });
  }

  async function handleDeleteRecord(recordId) {
    if (!window.confirm("Delete this financial record?")) {
      return;
    }

    try {
      await apiRequest(`/records/${recordId}`, { method: "DELETE", token });
      setBanner({ type: "success", text: "Record deleted successfully." });
      resetRecordForm();
      bumpRefresh();
    } catch (error) {
      setBanner({ type: "error", text: getErrorMessage(error) });
    }
  }

  async function handleUserSubmit(event) {
    event.preventDefault();

    try {
      const data = await apiRequest("/users", {
        method: "POST",
        token,
        body: userForm
      });

      setUserForm(createEmptyUserForm());
      setBanner({ type: "success", text: data.message });
      bumpRefresh();
    } catch (error) {
      setBanner({ type: "error", text: getErrorMessage(error) });
    }
  }

  async function handleUserSave(userId) {
    try {
      const data = await apiRequest(`/users/${userId}`, {
        method: "PATCH",
        token,
        body: userDrafts[userId]
      });

      if (currentUser?.id === userId) {
        setCurrentUser(data.user);
      }

      setBanner({ type: "success", text: data.message });
      bumpRefresh();
    } catch (error) {
      setBanner({ type: "error", text: getErrorMessage(error) });
    }
  }

  function handleFilterSubmit(event) {
    event.preventDefault();
    setRecordPage(1);
    bumpRefresh();
  }

  function handleResetFilters() {
    setFilters(defaultFilters);
    setRecordPage(1);
    bumpRefresh();
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient--left" />
      <div className="ambient ambient--right" />
      <div className="grid-overlay" />

      <header className="topbar-wrap">
        <div className="topbar">
          <a className="brand" href="#overview" aria-label="Finance Data Processing and Access Control">
            <span className="brand-mark" aria-hidden="true">
              <span className="brand-mark__bar brand-mark__bar--one" />
              <span className="brand-mark__bar brand-mark__bar--two" />
              <span className="brand-mark__bar brand-mark__bar--three" />
              <span className="brand-mark__dot" />
            </span>
            <span className="brand-copy">
              <strong>Finance Data</strong>
              <span>processing and access control</span>
            </span>
          </a>

          <div className="topbar-actions">
            <a className="button button--primary" href={currentUser ? "#insights" : "#access"}>
              {currentUser ? "Open Workspace" : "Access Platform"}
            </a>
            {currentUser ? (
              <button className="button button--ghost" type="button" onClick={handleLogout}>
                Sign out
              </button>
            ) : null}
          </div>
        </div>

        {currentUser ? (
          <div className="header-account-wrap">
            <section className="panel session-strip session-strip--header">
              <div>
                <span className={`badge badge--${currentUser.role}`}>{currentUser.role}</span>
                <h2>{currentUser.name}</h2>
                <p>{currentUser.email}</p>
              </div>

              <div className="session-meta">
                <span>Status: {currentUser.status}</span>
                <span>Last login: {formatDate(currentUser.lastLogin)}</span>
              </div>
            </section>
          </div>
        ) : null}
      </header>

      <main className="app">
        <section className="hero" id="overview">
          <div className="hero-center">
            <span className="eyebrow">Platform Capabilities</span>
            <h1 className="hero-title">
              Finance Data Built for{" "}
              <span className="gradient-text">Processing & Access Control</span>
            </h1>
            <p className="hero-copy">
              Comprehensive controls to manage permissions, process financial activity,
              and surface reliable operational insight from one secure workspace.
            </p>

            <div className="capability-row">
              {capabilityChips.map((chip) => (
                <span className="capability-chip" key={chip}>
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </section>

        {banner.text ? <div className={`notice notice--${banner.type || "info"}`}>{banner.text}</div> : null}

        {!currentUser ? (
          <AuthView
            authForm={authForm}
            setAuthForm={setAuthForm}
            onSubmit={handleLogin}
            loading={loading}
          />
        ) : (
          <>
            <DashboardSection
              dashboard={dashboard}
              filters={filters}
              setFilters={setFilters}
              onApplyFilters={handleFilterSubmit}
              onResetFilters={handleResetFilters}
            />

            {!canViewRecords ? (
              <section className="panel panel--viewer">
                <h2>Viewer Access</h2>
                <p>
                  Your role is intentionally limited to dashboard summaries. Record creation,
                  editing, and detailed listings are blocked by backend guards.
                </p>
              </section>
            ) : (
              <RecordsSection
                isAdmin={isAdmin}
                recordForm={recordForm}
                setRecordForm={setRecordForm}
                editingRecordId={editingRecordId}
                onSubmitRecord={handleRecordSubmit}
                onResetRecord={resetRecordForm}
                records={records}
                pagination={pagination}
                onEditRecord={handleEditRecord}
                onDeleteRecord={handleDeleteRecord}
                onPreviousPage={() => setRecordPage((page) => Math.max(page - 1, 1))}
                onNextPage={() =>
                  setRecordPage((page) =>
                    Math.min(page + 1, pagination?.totalPages || page + 1)
                  )
                }
              />
            )}

            {isAdmin ? (
              <UsersSection
                userForm={userForm}
                setUserForm={setUserForm}
                onSubmitUser={handleUserSubmit}
                users={users}
                userDrafts={userDrafts}
                setUserDrafts={setUserDrafts}
                onSaveUser={handleUserSave}
              />
            ) : null}
          </>
        )}
      </main>
    </div>
  );
}
