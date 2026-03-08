import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import getCurrentUserId from "../utils/getCurrentUserId";

export default function Dashboard() {

  const [groupCount, setGroupCount] = useState(0);
  const [youOwe, setYouOwe] = useState(0);
  const [youAreOwed, setYouAreOwed] = useState(0);
  const [recentExpenses, setRecentExpenses] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {

      const currentUserId = getCurrentUserId();

      const groupsRes = await api.get("/api/groups");
      const groups = groupsRes.data;

      setGroupCount(groups.length);

      let totalOwe = 0;
      let totalOwed = 0;

      let allExpenses = [];

      for (const group of groups) {

        const balanceRes = await api.get(`/api/groups/${group.id}/balances`);
        const balances = balanceRes.data;

        const userBalance = Number(balances[currentUserId] || 0);

        if (userBalance < 0) totalOwe += Math.abs(userBalance);
        if (userBalance > 0) totalOwed += userBalance;

        const expenseRes = await api.get(`/api/expenses/group/${group.id}`);
        const expenses = expenseRes.data;

        const formattedExpenses = expenses.map((exp) => ({
          id: exp.expense_id,
          title: exp.title,
          amount: exp.amount,
          paidBy: exp.paid_by,
          groupId: group.id,
          groupName: group.name
        }));

        allExpenses = [...allExpenses, ...formattedExpenses];
      }

      allExpenses.sort((a, b) => b.id - a.id);

      setRecentExpenses(allExpenses.slice(0, 5));

      setYouOwe(totalOwe);
      setYouAreOwed(totalOwed);

    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  };

  /* ---------------- EMPTY STATE ---------------- */

  if (groupCount === 0) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">

        <h1 className="text-3xl font-bold mb-8">
          Dashboard
        </h1>

        <div className="bg-white border rounded-xl shadow-sm p-12">

          <h2 className="text-2xl font-semibold mb-3">
            No Groups Yet
          </h2>

          <p className="text-gray-600 mb-6">
            Create your first group to start tracking shared expenses.
            Smart Expense Tracker will automatically calculate balances.
          </p>

          <Link to="/groups">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
              Create Your First Group
            </button>
          </Link>

        </div>

      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <div className="bg-white shadow-sm rounded-xl p-6 border hover:shadow-md transition">
          <p className="text-gray-500 text-sm font-medium">
            Active Groups
          </p>

          <h2 className="text-4xl font-bold mt-3">
            {groupCount}
          </h2>
        </div>

        <div className="bg-white shadow-sm rounded-xl p-6 border hover:shadow-md transition">
          <p className="text-gray-500 text-sm font-medium">
            You Owe
          </p>

          <h2 className="text-4xl font-bold mt-3 text-red-600">
            ₹{youOwe.toFixed(2)}
          </h2>
        </div>

        <div className="bg-white shadow-sm rounded-xl p-6 border hover:shadow-md transition">
          <p className="text-gray-500 text-sm font-medium">
            You Are Owed
          </p>

          <h2 className="text-4xl font-bold mt-3 text-green-600">
            ₹{youAreOwed.toFixed(2)}
          </h2>
        </div>

      </div>

      <div className="mb-12">

        <h2 className="text-xl font-semibold mb-4">
          Quick Actions
        </h2>

        <div className="bg-white border rounded-xl shadow-sm p-6 flex justify-between items-center">

          <div>
            <p className="font-medium">
              Manage Groups
            </p>

            <p className="text-sm text-gray-500">
              Create groups, add expenses and settle balances
            </p>
          </div>

          <Link to="/groups">
            <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
              Open
            </button>
          </Link>

        </div>

      </div>

      <div>

        <h2 className="text-xl font-semibold mb-4">
          Recent Activity
        </h2>

        <div className="bg-white border rounded-xl shadow-sm divide-y">

          {recentExpenses.length === 0 && (
            <div className="p-4 text-gray-500">
              No expenses yet
            </div>
          )}

          {recentExpenses.map((expense) => (
            <div
              key={expense.id}
              className="flex justify-between items-center p-4 hover:bg-gray-50 transition"
            >

              <div>
                <p className="font-medium">{expense.title}</p>

                <p className="text-sm text-gray-500">
                  Group #{expense.groupId} • {expense.groupName}
                </p>
              </div>

              <div className="font-semibold text-gray-800">
                ₹{Number(expense.amount).toFixed(2)}
              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}