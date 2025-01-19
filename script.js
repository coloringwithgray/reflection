document.addEventListener("DOMContentLoaded", () => {
  // Typed text configuration
  const text = "Reflections of (You)";
  let index = 0;
  const speed = 250;   // Milliseconds between each character
  const delay = 3000;  // Milliseconds delay before typing starts
  const textContainer = document.getElementById("animated-text");

  // Recursive typing function
  function type() {
    if (index < text.length) {
      textContainer.innerHTML += text.charAt(index);
      index++;
      setTimeout(type, speed);
    }
  }

  // Start typing after initial delay
  setTimeout(type, delay);

  // Detect if page is inside an iframe (portal)
  if (window.self !== window.top) {
    document.body.classList.add("is-portal");
  }

  // Handle scroll prompt fade-in
  const scrollPrompt = document.querySelector(".scroll-prompt");
  window.addEventListener(
    "scroll",
    () => {
      const scrollPosition = window.scrollY || document.documentElement.scrollTop;
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;

      // Show the scroll prompt after scrolling ~ half the viewport height
      if (scrollPosition > windowHeight / 2) {
        scrollPrompt.classList.add("visible");
      } else {
        scrollPrompt.classList.remove("visible");
      }
    },
    { passive: true } // Improves scroll performance
  );
});
