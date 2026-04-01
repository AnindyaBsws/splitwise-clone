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

      if (groups.length === 0) {
        setRecentExpenses([]);
        setYouOwe(0);
        setYouAreOwed(0);
        return;
      }

      /* ---------- FETCH BALANCES IN PARALLEL ---------- */

      const balanceRequests = groups.map((group) =>
        api.get(`/api/groups/${group.id}/balances`)
      );

      const balanceResponses = await Promise.all(balanceRequests);

      let totalOwe = 0;
      let totalOwed = 0;

      balanceResponses.forEach((res) => {

        const balances = res.data;
        const userBalance = Number(balances[currentUserId] || 0);

        if (userBalance < 0) totalOwe += Math.abs(userBalance);
        if (userBalance > 0) totalOwed += userBalance;

      });

      /* ---------- FETCH EXPENSES IN PARALLEL ---------- */

      const expenseRequests = groups.map((group) =>
        api.get(`/api/expenses/group/${group.id}`)
      );

      const expenseResponses = await Promise.all(expenseRequests);

      let allExpenses = [];

      expenseResponses.forEach((res, index) => {

        const group = groups[index];
        const expenses = res.data;

        const formattedExpenses = expenses.map((exp) => ({
          id: exp.expense_id,
          title: exp.title,
          amount: exp.amount,
          paidBy: exp.paid_by,
          groupId: group.id,
          groupName: group.name
        }));

        allExpenses = [...allExpenses, ...formattedExpenses];

      });

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
      <div className="page-container">

        <h1 className="text-3xl font-bold mb-8">
          Dashboard
        </h1>

        <div className="glass-card p-10 text-center">

          <h2 className="text-2xl font-semibold mb-3">
            No Groups Yet
          </h2>

          <p className="text-gray-300 mb-6">
            Create your first group to start tracking shared expenses.
          </p>

          <Link to="/groups">
            <button className="gradient-btn">
              Create Your First Group
            </button>
          </Link>

        </div>

      </div>
    );
  }

  return (

    <div className="page-container space-y-10">

      {/* HEADER */}
      <h1 className="text-3xl font-bold">
        Overview
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* LEFT SIDE */}
        <div className="lg:col-span-3 space-y-8">

          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="glass-card p-6 glass-hover">
              <p className="text-gray-400 text-sm">You Are Owed</p>
              <h2 className="text-4xl font-bold text-green-400 mt-3">
                ₹{youAreOwed.toFixed(2)}
              </h2>
            </div>

            <div className="glass-card p-6 glass-hover">
              <p className="text-gray-400 text-sm">You Owe</p>
              <h2 className="text-4xl font-bold text-red-400 mt-3">
                ₹{youOwe.toFixed(2)}
              </h2>
            </div>

            <div className="glass-card p-6 glass-hover">
              <p className="text-gray-400 text-sm">Active Groups</p>
              <h2 className="text-4xl font-bold mt-3">
                {groupCount}
              </h2>
            </div>

          </div>

          {/* QUICK ACTION (IMPROVED, NOT REMOVED) */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Quick Actions
            </h2>

            <div className="glass-card p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div>
                <p className="font-medium">
                  Manage Groups
                </p>
                <p className="text-sm text-gray-400">
                  Create groups, add expenses and settle balances
                </p>
              </div>

              <Link to="/groups">
                <button className="gradient-btn">
                  Open Groups
                </button>
              </Link>

            </div>
          </div>

          {/* RECENT ACTIVITY */}
          <div>

            <h2 className="text-xl font-semibold mb-4">
              Recent Activity
            </h2>

            <div className="glass-card divide-y divide-white/10">

              {recentExpenses.length === 0 && (
                <div className="p-4 text-gray-400">
                  No expenses yet
                </div>
              )}

              {recentExpenses.map((expense) => (

                <div
                  key={expense.id}
                  className="flex justify-between items-center p-4 hover:bg-white/5"
                >

                  <div>
                    <p className="font-medium">
                      {expense.title}
                    </p>
                    <p className="text-sm text-gray-400">
                      {expense.groupName}
                    </p>
                  </div>

                  <div className="font-semibold text-gray-200">
                    ₹{Number(expense.amount).toFixed(2)}
                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="space-y-6">

          <div className="glass-card p-6">

            <h2 className="text-lg font-semibold mb-4">
              Quick Actions
            </h2>

            <div className="flex flex-col gap-3">

              <Link to="/groups">
                <button className="gradient-btn w-full">
                  Manage Groups
                </button>
              </Link>

              <button className="glass-card p-3 text-left">
                Export Reports
              </button>

              <button className="glass-card p-3 text-left">
                Settle All Balances
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}