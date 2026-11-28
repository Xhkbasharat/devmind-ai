
import type { AnalysisRecommendation } from "../utils/analysisRecommendations";
import "../styles/analysis-recommendations.css";

interface AnalysisRecommendationsProps {
  recommendations: AnalysisRecommendation[];
}

const priorityStyles = {
  high: "recommendation-priority-high",
  medium: "recommendation-priority-medium",
  low: "recommendation-priority-low",
};

export default function AnalysisRecommendations({
  recommendations,
}: AnalysisRecommendationsProps) {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section
      className="analysis-recommendations"
      aria-labelledby="recommendations-heading"
    >
      <div className="analysis-recommendations-header">
        <div>
          <h2 id="recommendations-heading">
            Recommended Improvements
          </h2>
          <p>
            Practical actions based on your analysis findings.
          </p>
        </div>
      </div>

      <div className="recommendations-list">
        {recommendations.map((recommendation, index) => (
          <article
            className="recommendation-card"
            key={`${recommendation.title}-${index}`}
          >
            <div className="recommendation-card-header">
              <h3>{recommendation.title}</h3>

              <span
                className={`recommendation-priority ${
                  priorityStyles[recommendation.priority]
                }`}
              >
                {recommendation.priority}
              </span>
            </div>

            <p>{recommendation.description}</p>

            <div className="recommendation-action">
              <strong>Suggested action:</strong>
              <span>{recommendation.action}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
