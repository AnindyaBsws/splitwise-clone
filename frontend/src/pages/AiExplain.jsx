import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

function AiExplain() {

  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const mode = searchParams.get("mode") || "custom";

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

    <div className="page-container space-y-10 fade-in">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

        <h1 className="text-2xl font-bold flex items-center gap-2">
          🧠 AI Insights
        </h1>

        <div className="text-sm text-gray-400">
          Mode:{" "}
          <span className="text-primary font-medium">
            {mode === "gemini" ? "Gemini AI 🤖" : "Custom Logic 🧮"}
          </span>
        </div>

      </div>

      {/* MODE SWITCH */}
      <div className="flex gap-3">

        <button
          onClick={() => navigate(`/groups/${id}/ai?mode=gemini`)}
          className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition ${
            mode === "gemini"
              ? "gradient-btn"
              : "bg-white/5 border border-white/10 hover:bg-white/10"
          }`}
        >
          🤖 Gemini
        </button>

        <button
          onClick={() => navigate(`/groups/${id}/ai?mode=custom`)}
          className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition ${
            mode === "custom"
              ? "gradient-btn"
              : "bg-white/5 border border-white/10 hover:bg-white/10"
          }`}
        >
          🧮 Custom
        </button>

      </div>

      {/* AI CONTENT */}
      <div className="glass-card p-6">

        {loading ? (

          <p className="text-gray-400">
            Thinking...
          </p>

        ) : (

          <div
            className="space-y-3 text-gray-200 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: explanation
                .replace(/\n/g, "<br/>")
                .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
                .replace(/### (.*?)/g, "<h3 class='text-lg font-semibold mt-4'>$1</h3>")
            }}
          />

        )}

      </div>

      {/* FUTURE CHAT */}
      <div className="glass-card p-5 space-y-3">

        <p className="text-sm text-gray-400">
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