import { FinancialRecord } from "../models/FinancialRecord.js";

function roundCurrency(value) {
  return Number((value ?? 0).toFixed(2));
}

function mapRecord(record) {
  return {
    id: record._id.toString(),
    amount: record.amount,
    type: record.type,
    category: record.category,
    occurredAt: record.occurredAt,
    notes: record.notes,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    createdBy: record.createdBy
      ? {
          id: record.createdBy._id.toString(),
          name: record.createdBy.name,
          email: record.createdBy.email,
          role: record.createdBy.role
        }
      : null,
    updatedBy: record.updatedBy
      ? {
          id: record.updatedBy._id.toString(),
          name: record.updatedBy.name,
          email: record.updatedBy.email,
          role: record.updatedBy.role
        }
      : null
  };
}

export async function getDashboardSummary(match) {
  const [totals, categoryTotals, monthlyTrend, recentActivity, totalRecordCount] = await Promise.all([
    FinancialRecord.aggregate([
      { $match: match },
      { $group: { _id: "$type", total: { $sum: "$amount" } } }
    ]),
    FinancialRecord.aggregate([
      { $match: match },
      {
        $group: {
          _id: { category: "$category", type: "$type" },
          total: { $sum: "$amount" }
        }
      },
      {
        $group: {
          _id: "$_id.category",
          income: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "income"] }, "$total", 0]
            }
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "expense"] }, "$total", 0]
            }
          }
        }
      },
      {
        $addFields: {
          net: { $subtract: ["$income", "$expense"] },
          volume: { $add: ["$income", "$expense"] }
        }
      },
      { $sort: { volume: -1, _id: 1 } }
    ]),
    FinancialRecord.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            month: {
              $dateToString: {
                format: "%Y-%m",
                date: "$occurredAt"
              }
            },
            type: "$type"
          },
          total: { $sum: "$amount" }
        }
      },
      {
        $group: {
          _id: "$_id.month",
          income: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "income"] }, "$total", 0]
            }
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "expense"] }, "$total", 0]
            }
          }
        }
      },
      {
        $addFields: {
          net: { $subtract: ["$income", "$expense"] }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 6 }
    ]),
    FinancialRecord.find(match)
      .sort({ occurredAt: -1, createdAt: -1 })
      .limit(5)
      .populate("createdBy", "name email role")
      .populate("updatedBy", "name email role"),
    FinancialRecord.countDocuments(match)
  ]);

  const income = totals.find((item) => item._id === "income")?.total ?? 0;
  const expense = totals.find((item) => item._id === "expense")?.total ?? 0;

  return {
    totals: {
      income: roundCurrency(income),
      expense: roundCurrency(expense),
      netBalance: roundCurrency(income - expense),
      recordCount: totalRecordCount
    },
    categoryTotals: categoryTotals.map((item) => ({
      category: item._id,
      income: roundCurrency(item.income),
      expense: roundCurrency(item.expense),
      net: roundCurrency(item.net),
      volume: roundCurrency(item.volume)
    })),
    recentActivity: recentActivity.map(mapRecord),
    monthlyTrend: monthlyTrend.reverse().map((item) => ({
      month: item._id,
      income: roundCurrency(item.income),
      expense: roundCurrency(item.expense),
      net: roundCurrency(item.net)
    }))
  };
}

