document.addEventListener("DOMContentLoaded", () => {
  // 1. Typed text configuration
  const text = "Reflections of (You)";
  let index = 0;
  const speed = 250;   // Milliseconds between each character
  const delay = 3000;  // Milliseconds delay before typing starts
  const textContainer = document.getElementById("animated-text")
    // Toggle Q&A Section Visibility
const askBtn = document.getElementById('ask-question-btn');
const askSection = document.getElementById('ask-section');

if (askBtn) {
  askBtn.addEventListener('click', () => {
    askSection.style.display = askSection.style.display === 'none' ? 'block' : 'none';
  });
}

// Handle Question Submission
const submitBtn = document.getElementById('submit-question-btn');
const questionInput = document.getElementById('question-input');
const answerOutput = document.getElementById('answer-output');

if (submitBtn) {
  submitBtn.addEventListener('click', async () => {
    const question = questionInput.value.trim();
    if (!question) {
      answerOutput.innerText = "Please enter a question.";
      return;
    }

    answerOutput.innerText = "Thinking...";
    
    try {
      const response = await fetch('https://product-agent-backend.onrender.com/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();
      answerOutput.innerText = data.reply || "Sorry, I couldn't get an answer.";
    } catch (error) {
      console.error(error);
      answerOutput.innerText = "Error connecting to the server.";
    }
  });
}
;

  // 2. Recursive typing function
  function type() {
    if (index < text.length) {
      textContainer.innerHTML += text.charAt(index);
      index++;
      setTimeout(type, speed);
    } else {
      // Once typing is done, reveal the action buttons
      const actionButtons = document.getElementById("action-buttons");
      if (actionButtons) {
        actionButtons.classList.add("loaded");
      }
    }
  }

  // 3. Start typing after initial delay
  setTimeout(type, delay);

  // 4. Detect if page is inside an iframe (portal)
  if (window.self !== window.top) {
    document.body.classList.add("is-portal");
  }

  // 5. Handle scroll prompt fade-in (if applicable)
  const scrollPrompt = document.querySelector(".scroll-prompt");
  if (scrollPrompt) {
    window.addEventListener(
      "scroll",
      () => {
        const scrollPosition = window.scrollY || document.documentElement.scrollTop;
        const windowHeight =
          window.innerHeight || document.documentElement.clientHeight;

        if (scrollPosition > windowHeight / 2) {
          scrollPrompt.classList.add("visible");
        } else {
          scrollPrompt.classList.remove("visible");
        }
      },
      { passive: true }
    );
  }
});
