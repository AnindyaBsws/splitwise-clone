import { useState, useEffect } from "react";
import api from "../api/axios";

/* -----------------------------
   SIMPLE IN-MEMORY CACHE
------------------------------ */

const groupCache = {};
const CACHE_DURATION = 10000; // 10 seconds


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

        /* -----------------------------
           CHECK CACHE FIRST
        ------------------------------ */

        const cached = groupCache[id];

        if (cached && Date.now() - cached.time < CACHE_DURATION) {

          setGroupInfo(cached.groupInfo);
          setMembers(cached.members);
          setAllUsers(cached.allUsers);
          setExpenses(cached.expenses);
          setBalances(cached.balances);
          setSimplifiedDebts(cached.simplifiedDebts);

          setLoading(false);
          return;
        }

        /* -----------------------------
           FETCH DATA FROM API
        ------------------------------ */

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

        const newData = {
          groupInfo: groupRes.data,
          members: membersRes.data,
          allUsers: usersRes.data,
          expenses: expensesRes.data,
          balances: balancesRes.data,
          simplifiedDebts: debtsRes.data,
          time: Date.now()
        };

        /* -----------------------------
           SAVE TO CACHE
        ------------------------------ */

        groupCache[id] = newData;

        setGroupInfo(newData.groupInfo);
        setMembers(newData.members);
        setAllUsers(newData.allUsers);
        setExpenses(newData.expenses);
        setBalances(newData.balances);
        setSimplifiedDebts(newData.simplifiedDebts);

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