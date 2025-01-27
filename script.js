document.addEventListener("DOMContentLoaded", () => {
  // Portal detection
  if (window.self !== window.top) {
    document.body.classList.add("is-portal");
    return;
  }

  // Typing animation
  const text = "Reflections of (You)";
  const textContainer = document.getElementById("animated-text");
  let index = 0;
  
  function typeText() {
    if (index < text.length) {
      requestAnimationFrame(() => {
        textContainer.textContent += text.charAt(index);
        index++;
        // Longer pause on first character
        setTimeout(typeText, index === 1 ? 1500 : 250);
      });
    } else {
      document.getElementById("action-buttons")?.classList.add("loaded");
    }
  }
  typeText();

  // Q&A Section
  const qaSection = document.getElementById("ask-section");
  const questionInput = document.getElementById("question-input");
  const answerOutput = document.getElementById("answer-output");
  
  // Toggle visibility
  document.getElementById("ask-question-btn")?.addEventListener("click", () => {
    const isActive = qaSection.classList.toggle("active");
    qaSection.setAttribute("aria-hidden", !isActive);
    if (isActive) {
      questionInput.focus({ preventScroll: true });
    }
  });

  // Simple sanitization to prevent HTML injection
  function sanitizeInput(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const question = sanitizeInput(questionInput.value.trim());
    
    if (!question) {
      answerOutput.textContent = "Please enter a valid question";
      return;
    }

    answerOutput.textContent = "Thinking...";
    answerOutput.setAttribute("aria-busy", "true");

    try {
      const controller = new AbortController();
      // Set a timeout to abort fetch if it takes too long
      setTimeout(() => controller.abort(), 15000);

      const response = await fetch("https://product-agent-backend.onrender.com/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      answerOutput.textContent = data.reply || "No answer available";
    } catch (error) {
      if (error.name === "AbortError") {
        answerOutput.textContent = "Request timed out. Please try again.";
      } else {
        answerOutput.textContent = "Error connecting to service. Click to retry.";
        answerOutput.addEventListener("click", handleSubmit, { once: true });
      }
    } finally {
      answerOutput.removeAttribute("aria-busy");
    }
  }

  document.getElementById("submit-question-btn")?.addEventListener("click", handleSubmit);
  questionInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  });

  // Performance / Data Saver
  window.addEventListener("load", () => {
    if ("connection" in navigator) {
      if (navigator.connection.saveData || navigator.connection.effectiveType.includes("2g")) {
        const backgroundVideo = document.querySelector(".background-video");
        if (backgroundVideo) {
          backgroundVideo.remove();
        }
      }
    }
  });
});
