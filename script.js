document.addEventListener("DOMContentLoaded", () => {
  // 1. Detect if page is inside an iframe (portal) and add 'is-portal' class
  const isPortal = window.self !== window.top;
  if (isPortal) {
    document.body.classList.add("is-portal");
    // Exit early since we don't need to initialize other functionalities
    return;
  }

  // 2. Typed Text Configuration
  const text = "Reflections of (You)";
  let index = 0;
  const speed = 250;   // Milliseconds between each character
  const delay = 3000;  // Milliseconds delay before typing starts
  const textContainer = document.getElementById("animated-text");

  /**
   * Recursively types out the text one character at a time.
   */
  function typeText() {
    if (index < text.length) {
      textContainer.textContent += text.charAt(index);
      index++;
      setTimeout(typeText, speed);
    } else {
      // Once typing is done, reveal the action buttons
      const actionButtons = document.getElementById("action-buttons");
      if (actionButtons) {
        actionButtons.classList.add("loaded");
      }
    }
  }

  /**
   * Initiates the typing effect after the specified delay.
   */
  function initiateTyping() {
    setTimeout(typeText, delay);
  }

  // Start the typing animation
  initiateTyping();

  // 3. Toggle Q&A Section Visibility
  const askBtn = document.getElementById('ask-question-btn');
  const askSection = document.getElementById('ask-section');

  if (askBtn && askSection) {
    askBtn.addEventListener('click', () => {
      const isActive = askSection.classList.toggle('active');
      askBtn.setAttribute('aria-expanded', isActive);
      askSection.setAttribute('aria-hidden', !isActive);

      if (isActive) {
        // Shift focus to the input field when Q&A is opened
        const questionInput = document.getElementById('question-input');
        if (questionInput) {
          questionInput.focus();
        }
      } else {
        // Return focus to the "Ask Questions" button when Q&A is closed
        askBtn.focus();
      }
    });
  }

  // 4. Handle Question Submission
  const submitBtn = document.getElementById('submit-question-btn');
  const questionInput = document.getElementById('question-input');
  const answerOutput = document.getElementById('answer-output');

  if (submitBtn && questionInput && answerOutput) {
    /**
     * Handles the submission of a question.
     */
    async function handleQuestionSubmission() {
      const question = questionInput.value.trim();
      if (!question) {
        answerOutput.textContent = "Please enter a question.";
        return;
      }

      // Disable the submit button to prevent multiple submissions
      submitBtn.disabled = true;
      answerOutput.textContent = "Thinking...";

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

        const response = await fetch('https://product-agent-backend.onrender.com/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }

        const data = await response.json();
        answerOutput.textContent = data.reply || "Sorry, I couldn't get an answer.";
      } catch (error) {
        if (error.name === 'AbortError') {
          answerOutput.textContent = "Request timed out. Please try again.";
        } else {
          console.error(error);
          answerOutput.textContent = "Error connecting to the server.";
        }
      } finally {
        // Re-enable the submit button after processing
        submitBtn.disabled = false;
        // Clear the input field
        questionInput.value = '';
      }
    }

    // Event listener for the submit button
    submitBtn.addEventListener('click', handleQuestionSubmission);

    // Allow submission via Enter key
    questionInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleQuestionSubmission();
      }
    });
  }

  // 5. Handle Scroll Prompt Fade-In (Optional)
  // Uncomment and implement if needed
  /*
  const scrollPrompt = document.querySelector(".scroll-prompt");
  if (scrollPrompt) {
    let isVisible = false;
    window.addEventListener(
      "scroll",
      () => {
        const scrollPosition = window.scrollY || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;

        if (scrollPosition > windowHeight / 2 && !isVisible) {
          scrollPrompt.classList.add("visible");
          isVisible = true;
        } else if (scrollPosition <= windowHeight / 2 && isVisible) {
          scrollPrompt.classList.remove("visible");
          isVisible = false;
        }
      },
      { passive: true }
    );
  }
  */
});
