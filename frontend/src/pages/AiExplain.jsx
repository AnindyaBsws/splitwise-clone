import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

function AiExplain() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const mode = searchParams.get("mode") || "custom"; // default

  const [loading, setLoading] = useState(true);
  const [explanation, setExplanation] = useState("");

  useEffect(() => {
    const fetchExplanation = async () => {
      try {
        let res;

        if (mode === "gemini") {
          res = await api.get(`/api/ai/gemini/${id}`);
        } else {
          res = await api.get(`/api/ai/custom/${id}`);
        }

        setExplanation(res.data.explanation);
      } catch (error) {
        console.error("AI Error:", error);
        setExplanation("Failed to load AI explanation.");
      } finally {
        setLoading(false);
      }
    };

    fetchExplanation();
  }, [id, mode]);

  return (
    <div className="page-container space-y-8 fade-in">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          🧠 AI Debt Explanation
        </h1>
      </div>

      {/* MODE BADGE */}
      <div className="text-sm text-gray-400">
        Mode:{" "}
        <span className="text-indigo-400 font-semibold">
          {mode === "gemini" ? "Gemini AI 🤖" : "Custom Logic 🧮"}
        </span>
      </div>

      {/* CONTENT */}
      <div className="glass-card p-6">
        {loading ? (
          <p className="text-gray-400">Thinking...</p>
        ) : (
          <p className="text-gray-200 leading-relaxed whitespace-pre-line">
            {explanation}
          </p>
        )}
      </div>

      {/* SWITCH BUTTONS */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate(`/groups/${id}/ai?mode=gemini`)}
          className="gradient-btn flex-1"
        >
          🤖 Gemini
        </button>

        <button
          onClick={() => navigate(`/groups/${id}/ai?mode=custom`)}
          className="border border-indigo-500 text-indigo-400 hover:bg-indigo-500/10 rounded-xl px-4 py-2 flex-1"
        >
          🧮 Custom
        </button>
      </div>

      {/* CHAT PLACEHOLDER */}
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