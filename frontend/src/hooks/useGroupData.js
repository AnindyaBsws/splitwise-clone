import { useState, useEffect } from "react";
import api from "../api/axios";

function useGroupData(id) {

  const [allUsers, setAllUsers] = useState([]);
  const [groupInfo, setGroupInfo] = useState(null);
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({});
  const [simplifiedDebts, setSimplifiedDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    const res = await api.get(`/api/groups/${id}/members`);
    setMembers(res.data);
  };

  const fetchExpenses = async () => {
    const res = await api.get(`/api/expenses/group/${id}`);
    setExpenses(res.data);
  };

  const fetchBalances = async () => {
    const res = await api.get(`/api/groups/${id}/balances`);
    setBalances(res.data);
  };

  const fetchSimplifiedDebts = async () => {
    const res = await api.get(`/api/groups/${id}/simplify`);
    setSimplifiedDebts(res.data);
  };

  useEffect(() => {
    if (!id) return;
    const fetchAllData = async () => {

      setLoading(true);

      try {

        const [
          groupRes,
          membersRes,
          usersRes,
          expensesRes,
          balancesRes,
          debtsRes
        ] = await Promise.all([
          api.get(`/api/groups/${id}`),
          api.get(`/api/groups/${id}/members`),
          api.get("/api/users/"),
          api.get(`/api/expenses/group/${id}`),
          api.get(`/api/groups/${id}/balances`),
          api.get(`/api/groups/${id}/simplify`)
        ]);

        setGroupInfo(groupRes.data);
        setMembers(membersRes.data);
        setAllUsers(usersRes.data);
        setExpenses(expensesRes.data);
        setBalances(balancesRes.data);
        setSimplifiedDebts(debtsRes.data);

      } catch (error) {

        console.error("Error loading group data:", error);

      } finally {

        setLoading(false);

      }

    };

    fetchAllData();

  }, [id]);

  return {
    loading,
    allUsers,
    groupInfo,
    members,
    expenses,
    balances,
    simplifiedDebts,
    fetchMembers,
    fetchExpenses,
    fetchBalances,
    fetchSimplifiedDebts
  };
}

export default useGroupData;