import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

function AiExplain() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [explanation, setExplanation] = useState("");

  useEffect(() => {
    const fetchExplanation = async () => {
      try {
        const res = await api.get(`/api/ai/explain/${id}`);
        setExplanation(res.data.explanation);
      } catch (error) {
        console.error("AI Error:", error);
        setExplanation("Failed to load AI explanation.");
      } finally {
        setLoading(false);
      }
    };

    fetchExplanation();
  }, [id]);

  return (
    <div className="page-container space-y-8 fade-in">

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          🧠 AI Debt Explanation
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-400 hover:text-white"
        >
          ← Back
        </button>
      </div>

      <div className="glass-card p-6">
        {loading ? (
          <p className="text-gray-400">Thinking...</p>
        ) : (
          <p className="text-gray-200 leading-relaxed whitespace-pre-line">
            {explanation}
          </p>
        )}
      </div>

      <div className="glass-card p-5">
        <p className="text-sm text-gray-400 mb-3">
          Ask follow-up (coming soon)
        </p>

        <input
          type="text"
          placeholder="Why do I owe so much?"
          disabled
          className="neon-input w-full opacity-50 cursor-not-allowed"
        />
      </div>

    </div>
  );
}

export default AiExplain;