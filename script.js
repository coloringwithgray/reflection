document.addEventListener("DOMContentLoaded", () => {
  // Portal detection
  if (window.self !== window.top) {
    document.body.classList.add("is-portal");
    return;
  }

  const backgroundVideo = document.querySelector(".background-video");
  const loadingOverlay = document.querySelector(".loading-overlay");
  const textContainer = document.getElementById("animated-text");
  const actionButtons = document.getElementById("action-buttons");

  let videoReady = false;

  // Fade in video when it's ready
  backgroundVideo.addEventListener("canplaythrough", () => {
    videoReady = true;
    // Fade in the video
    backgroundVideo.style.opacity = "1";
    // Fade out the overlay
    loadingOverlay.style.opacity = "0";
    // Once that fade completes, remove it
    setTimeout(() => {
      loadingOverlay.remove();
    }, 1000);

    // Start the typing animation
    startTyping();
  });

  // Fallback if the event never fires (e.g., blocked in an iframe)
  setTimeout(() => {
    if (!videoReady) {
      // Hide or remove the video & overlay
      backgroundVideo.remove();
      loadingOverlay.remove();
      // Start typing anyway
      startTyping();
    }
  }, 5000);

  function startTyping() {
    textContainer.style.visibility = "visible";
    const text = "Reflections of (You)";
    let index = 0;

    function typeChar() {
      if (index < text.length) {
        textContainer.textContent += text.charAt(index);
        index++;
        setTimeout(typeChar, index === 1 ? 1500 : 250);
      } else {
        actionButtons?.classList.add("loaded");
      }
    }
    typeChar();
  }

  // Q&A Section
  const qaSection = document.getElementById("ask-section");
  const questionInput = document.getElementById("question-input");
  const answerOutput = document.getElementById("answer-output");

  document.getElementById("ask-question-btn")?.addEventListener("click", () => {
    const isActive = qaSection.classList.toggle("active");
    qaSection.setAttribute("aria-hidden", !isActive);
    if (isActive) {
      questionInput.focus({ preventScroll: true });
    }
  });

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
        backgroundVideo.remove();
        loadingOverlay.remove();
      }
    }
  });
});
