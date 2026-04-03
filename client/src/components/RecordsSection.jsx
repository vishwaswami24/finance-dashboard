import { formatCurrency, formatDate, getCategoryOptions } from "../utils.js";

export function RecordsSection({
  isAdmin,
  recordForm,
  setRecordForm,
  editingRecordId,
  onSubmitRecord,
  onResetRecord,
  records,
  pagination,
  onEditRecord,
  onDeleteRecord,
  onPreviousPage,
  onNextPage
}) {
  return (
    <section className="split-grid section-grid" id="records">
      {isAdmin ? (
        <form className="panel" onSubmit={onSubmitRecord}>
          <div className="section-head">
            <div>
              <h2>{editingRecordId ? "Update Record" : "Create Record"}</h2>
              <p>Admins can add, edit, and soft-delete financial entries.</p>
            </div>
          </div>

          <label>
            Amount
            <input
              type="number"
              min="0"
              step="0.01"
              value={recordForm.amount}
              onChange={(event) =>
                setRecordForm((current) => ({ ...current, amount: event.target.value }))
              }
            />
          </label>

          <label>
            Type
            <select
              value={recordForm.type}
              onChange={(event) =>
                setRecordForm((current) => ({ ...current, type: event.target.value }))
              }
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </label>

          <label>
            Category
            <select
              value={recordForm.category}
              onChange={(event) =>
                setRecordForm((current) => ({ ...current, category: event.target.value }))
              }
            >
              {getCategoryOptions(recordForm.category).map((category) => (
                <option value={category} key={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label>
            Date
            <input
              type="date"
              value={recordForm.occurredAt}
              onChange={(event) =>
                setRecordForm((current) => ({ ...current, occurredAt: event.target.value }))
              }
            />
          </label>

          <label>
            Notes
            <textarea
              rows="4"
              value={recordForm.notes}
              onChange={(event) =>
                setRecordForm((current) => ({ ...current, notes: event.target.value }))
              }
            />
          </label>

          <div className="button-row">
            <button className="button button--primary" type="submit">
              {editingRecordId ? "Save Changes" : "Add Record"}
            </button>
            <button className="button button--ghost" type="button" onClick={onResetRecord}>
              Clear
            </button>
          </div>
        </form>
      ) : null}

      <section className="panel">
        <div className="section-head">
          <div>
            <h2>Financial Records</h2>
            <p>Analysts can inspect the record set, while admins can modify it.</p>
          </div>
        </div>

        {records.length ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Notes</th>
                {isAdmin ? <th>Actions</th> : null}
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>{formatDate(record.occurredAt)}</td>
                  <td>{record.category}</td>
                  <td>
                    <span className={`pill pill--${record.type}`}>{record.type}</span>
                  </td>
                  <td>{formatCurrency(record.amount)}</td>
                  <td>{record.notes || "No notes"}</td>
                  {isAdmin ? (
                    <td>
                      <div className="table-actions">
                        <button
                          className="button button--ghost button--small"
                          type="button"
                          onClick={() => onEditRecord(record)}
                        >
                          Edit
                        </button>
                        <button
                          className="button button--danger button--small"
                          type="button"
                          onClick={() => onDeleteRecord(record.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty-state">No records match the current filters.</p>
        )}

        {pagination ? (
          <div className="pagination">
            <button
              className="button button--ghost button--small"
              type="button"
              onClick={onPreviousPage}
              disabled={pagination.page <= 1}
            >
              Previous
            </button>
            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              className="button button--ghost button--small"
              type="button"
              onClick={onNextPage}
              disabled={pagination.page >= pagination.totalPages}
            >
              Next
            </button>
          </div>
        ) : null}
      </section>
    </section>
  );
}
