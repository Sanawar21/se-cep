// Rubric Viewer - Shared functionality for viewing rubric scores

async function viewRubricScores(submissionId) {
  if (!submissionId) {
    alert("No submission found for this lab.");
    return;
  }

  try {
    const res = await fetch(`/api/submission_scores/${submissionId}`);
    const data = await res.json();

    if (!data.success) {
      alert("No rubric scores found for this submission.");
      return;
    }

    if (!data.scores || data.scores.length === 0) {
      alert("This submission has not been graded with a rubric yet.");
      return;
    }

    showRubricModal(data);
  } catch (error) {
    console.error("Error fetching rubric scores:", error);
    alert("Failed to load rubric scores.");
  }
}

function showRubricModal(data) {
  const modal = document.getElementById("rubric-view-modal");
  if (!modal) {
    console.error("Rubric view modal not found");
    return;
  }

  const criteriaHtml = data.scores.map(score => `
    <div class="rubric-criterion-view">
      <div class="criterion-header">
        <strong>${score.CRITERION_NAME}</strong>
        <span class="criterion-score">${score.SCORE} / ${score.MAX_SCORE} points</span>
      </div>
      <p class="criterion-description">${score.CRITERION_DESCRIPTION || ""}</p>
      ${score.COMMENTS ? `<div class="criterion-comments">
        <strong>Feedback:</strong> ${score.COMMENTS}
      </div>` : ""}
    </div>
  `).join("");

  const percentage = ((data.total_score / data.max_total_score) * 100).toFixed(1);
  
  document.getElementById("rubric-criteria-view").innerHTML = criteriaHtml;
  document.getElementById("rubric-total-score").textContent = data.total_score;
  document.getElementById("rubric-max-score").textContent = data.max_total_score;
  document.getElementById("rubric-percentage").textContent = percentage;

  modal.style.display = "block";
}

function closeRubricModal() {
  const modal = document.getElementById("rubric-view-modal");
  if (modal) {
    modal.style.display = "none";
  }
}

// Close modal when clicking outside
window.addEventListener("click", function(event) {
  const modal = document.getElementById("rubric-view-modal");
  if (event.target === modal) {
    closeRubricModal();
  }
});
