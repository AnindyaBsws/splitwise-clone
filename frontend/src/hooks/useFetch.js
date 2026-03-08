import { useState, useEffect } from "react";
import api from "../api/axios";

function useFetch(url, dependencies = []) {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {

      setLoading(true);

      const res = await api.get(url);

      setData(res.data);
      setError(null);

    } catch (err) {

      console.error("Fetch error:", err);
      setError(err);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };

}

export default useFetch;