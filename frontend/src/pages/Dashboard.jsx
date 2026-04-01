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

        <h1 className="text-3xl font-bold mb-8 text-[#E5E7EB]">
          Dashboard
        </h1>

        <div className="p-10 text-center rounded-2xl 
          bg-[#111217] border border-[#22232A]">

          <h2 className="text-2xl font-semibold mb-3 text-white">
            No Groups Yet
          </h2>

          <p className="text-[#9CA3AF] mb-6">
            Create your first group to start tracking shared expenses.
          </p>

          <Link to="/groups">
            <button className="px-5 py-2 rounded-lg 
              bg-gradient-to-r from-indigo-500 to-purple-600 
              text-white font-medium hover:opacity-90 transition">
              Create Your First Group
            </button>
          </Link>

        </div>

      </div>

    );

  }

  return (

    <div className="page-container">

      <h1 className="text-3xl font-bold mb-8 text-[#E5E7EB]">
        Dashboard
      </h1>

      {/* SUMMARY CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <div className="p-6 rounded-2xl 
          bg-[#111217] border border-[#22232A]
          hover:bg-[#1A1B21] transition">

          <p className="text-[#9CA3AF] text-sm font-medium">
            Active Groups
          </p>

          <h2 className="text-4xl font-bold mt-3 text-white">
            {groupCount}
          </h2>

        </div>

        <div className="p-6 rounded-2xl 
          bg-[#111217] border border-[#22232A]
          hover:bg-[#1A1B21] transition">

          <p className="text-[#9CA3AF] text-sm font-medium">
            You Owe
          </p>

          <h2 className="text-4xl font-bold mt-3 text-red-400">
            ₹{youOwe.toFixed(2)}
          </h2>

        </div>

        <div className="p-6 rounded-2xl 
          bg-[#111217] border border-[#22232A]
          hover:bg-[#1A1B21] transition">

          <p className="text-[#9CA3AF] text-sm font-medium">
            You Are Owed
          </p>

          <h2 className="text-4xl font-bold mt-3 text-green-400">
            ₹{youAreOwed.toFixed(2)}
          </h2>

        </div>

      </div>

      {/* QUICK ACTION */}

      <div className="mb-12">

        <h2 className="text-xl font-semibold mb-4 text-[#E5E7EB]">
          Quick Actions
        </h2>

        <div className="p-6 rounded-2xl 
          bg-[#111217] border border-[#22232A]
          flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <p className="font-medium text-white">
              Manage Groups
            </p>

            <p className="text-sm text-[#9CA3AF]">
              Create groups, add expenses and settle balances
            </p>

          </div>

          <Link to="/groups">
            <button className="px-5 py-2 rounded-lg 
              bg-gradient-to-r from-indigo-500 to-purple-600 
              text-white font-medium hover:opacity-90 transition">
              Open Groups
            </button>
          </Link>

        </div>

      </div>

      {/* RECENT ACTIVITY */}

      <div>

        <h2 className="text-xl font-semibold mb-4 text-[#E5E7EB]">
          Recent Activity
        </h2>

        <div className="rounded-2xl 
          bg-[#111217] border border-[#22232A] overflow-hidden">

          {recentExpenses.length === 0 && (

            <div className="p-4 text-[#9CA3AF]">
              No expenses yet
            </div>

          )}

          {recentExpenses.map((expense) => (

            <div
              key={expense.id}
              className="flex justify-between items-center p-4
              hover:bg-[#1A1B21] transition border-b border-[#22232A]"
            >

              <div>

                <p className="font-medium text-white">
                  {expense.title}
                </p>

                <p className="text-sm text-[#9CA3AF]">
                  {expense.groupName}
                </p>

              </div>

              <div className="font-semibold text-[#E5E7EB]">
                ₹{Number(expense.amount).toFixed(2)}
              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}