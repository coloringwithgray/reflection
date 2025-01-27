document.addEventListener("DOMContentLoaded", () => {
  // If loaded in an iframe, skip advanced logic (optional).
  if (window.self !== window.top) {
    document.body.classList.add("is-portal");
    return;
  }

  const backgroundVideo = document.querySelector(".background-video");
  const textContainer = document.getElementById("animated-text");
  const actionButtons = document.getElementById("action-buttons");

  let videoReady = false;

  // Fade in video once it has enough data to play
  backgroundVideo.addEventListener("canplaythrough", () => {
    videoReady = true;
    backgroundVideo.style.opacity = "1"; // fade from 0 to 1
    startTyping();
  });

  // Fallback if canplaythrough never fires (blocked or slow)
  setTimeout(() => {
    if (!videoReady) {
      backgroundVideo.remove();
      startTyping();
    }
  }, 5000);

  // Type "Reflections of (You)" text
  function startTyping() {
    textContainer.style.visibility = "visible";
    const text = "Reflections of (You)";
    let index = 0;

    function typeChar() {
      if (index < text.length) {
        textContainer.textContent += text.charAt(index);
        index++;
        // Slightly longer pause after first char
        setTimeout(typeChar, index === 1 ? 1500 : 250);
      } else {
        // When done typing, show the action buttons
        actionButtons?.classList.add("loaded");
      }
    }
    typeChar();
  }

  // Q&A Section
  const qaSection = document.getElementById("ask-section");
  const questionInput = document.getElementById("question-input");
  const answerOutput = document.getElementById("answer-output");

  // Toggle Q&A form visibility
  document.getElementById("ask-question-btn")?.addEventListener("click", () => {
    const isActive = qaSection.classList.toggle("active");
    qaSection.setAttribute("aria-hidden", !isActive);
    if (isActive) {
      questionInput.focus({ preventScroll: true });
    }
  });

  // Simple input sanitization
  function sanitizeInput(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // Handle question submission
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
      // Abort if it takes more than 15 seconds
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

  // Submit question on button click or Enter key
  document.getElementById("submit-question-btn")?.addEventListener("click", handleSubmit);
  questionInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  });

  // Performance / Data-Saver detection
  window.addEventListener("load", () => {
    if ("connection" in navigator) {
      if (navigator.connection.saveData || navigator.connection.effectiveType.includes("2g")) {
        backgroundVideo.remove();
      }
    }
  });
});
