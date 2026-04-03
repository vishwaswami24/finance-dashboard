import { formatCurrency, formatDate, recordCategories } from "../utils.js";

function SummaryCard({ label, value, tone }) {
  return (
    <article className={`summary-card summary-card--${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

export function DashboardSection({ dashboard, filters, setFilters, onApplyFilters, onResetFilters }) {
  return (
    <section className="panel panel--section" id="insights">
      <div className="section-head">
        <div>
          <h2>Dashboard Summary</h2>
          <p>Apply filters once and refresh both the dashboard metrics and the records list.</p>
        </div>
      </div>

      <form className="toolbar" onSubmit={onApplyFilters}>
        <select
          value={filters.category}
          onChange={(event) =>
            setFilters((current) => ({ ...current, category: event.target.value }))
          }
        >
          <option value="">All categories</option>
          {recordCategories.map((category) => (
            <option value={category} key={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={filters.type}
          onChange={(event) => setFilters((current) => ({ ...current, type: event.target.value }))}
        >
          <option value="">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <input
          type="date"
          value={filters.startDate}
          onChange={(event) =>
            setFilters((current) => ({ ...current, startDate: event.target.value }))
          }
        />

        <input
          type="date"
          value={filters.endDate}
          onChange={(event) =>
            setFilters((current) => ({ ...current, endDate: event.target.value }))
          }
        />

        <input
          placeholder="Search notes"
          value={filters.search}
          onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
        />

        <button className="button button--primary" type="submit">
          Apply
        </button>
        <button className="button button--ghost" type="button" onClick={onResetFilters}>
          Reset
        </button>
      </form>

      <div className="summary-grid">
        <SummaryCard
          label="Total Income"
          value={formatCurrency(dashboard?.totals?.income)}
          tone="income"
        />
        <SummaryCard
          label="Total Expense"
          value={formatCurrency(dashboard?.totals?.expense)}
          tone="expense"
        />
        <SummaryCard
          label="Net Balance"
          value={formatCurrency(dashboard?.totals?.netBalance)}
          tone="neutral"
        />
        <SummaryCard
          label="Tracked Records"
          value={dashboard?.totals?.recordCount ?? 0}
          tone="volume"
        />
      </div>

      <div className="content-grid">
        <div className="mini-panel">
          <h3>Category Totals</h3>
          {dashboard?.categoryTotals?.length ? (
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Income</th>
                  <th>Expense</th>
                  <th>Net</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.categoryTotals.map((item) => (
                  <tr key={item.category}>
                    <td>{item.category}</td>
                    <td>{formatCurrency(item.income)}</td>
                    <td>{formatCurrency(item.expense)}</td>
                    <td>{formatCurrency(item.net)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty-state">No category totals match the current filters.</p>
          )}
        </div>

        <div className="mini-panel">
          <h3>Monthly Trend</h3>
          {dashboard?.monthlyTrend?.length ? (
            <div className="trend-list">
              {dashboard.monthlyTrend.map((item) => (
                <article className="trend-item" key={item.month}>
                  <div>
                    <strong>{item.month}</strong>
                    <span>Net {formatCurrency(item.net)}</span>
                  </div>
                  <div>
                    <span>In {formatCurrency(item.income)}</span>
                    <span>Out {formatCurrency(item.expense)}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="empty-state">No trend data is available yet.</p>
          )}
        </div>
      </div>

      <div className="mini-panel">
        <h3>Recent Activity</h3>
        {dashboard?.recentActivity?.length ? (
          <div className="activity-list">
            {dashboard.recentActivity.map((item) => (
              <article className="activity-item" key={item.id}>
                <div>
                  <strong>{item.category}</strong>
                  <p>{item.notes || "No notes added."}</p>
                </div>
                <div className="activity-meta">
                  <span>{item.type}</span>
                  <strong>{formatCurrency(item.amount)}</strong>
                  <span>{formatDate(item.occurredAt)}</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="empty-state">Recent activity will appear once records are created.</p>
        )}
      </div>
    </section>
  );
}
