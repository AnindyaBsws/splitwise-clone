import { useState, useEffect } from "react";
import api from "../api/axios";

function useGroupData(id) {

  const [allUsers, setAllUsers] = useState([]);
  const [groupInfo, setGroupInfo] = useState(null);
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({});
  const [simplifiedDebts, setSimplifiedDebts] = useState([]);

  const fetchMembers = async () => {
    const res = await api.get(`/api/groups/${id}/members`);
    setMembers(res.data);
  };

  const fetchUsers = async () => {
    const res = await api.get("/api/users/");
    setAllUsers(res.data);
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

  const fetchGroupInfo = async () => {
    const res = await api.get(`/api/groups/${id}`);
    setGroupInfo(res.data);
  };

  useEffect(() => {
    fetchGroupInfo();
    fetchMembers();
    fetchUsers();
    fetchExpenses();
    fetchBalances();
    fetchSimplifiedDebts();
  }, [id]);

  return {
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