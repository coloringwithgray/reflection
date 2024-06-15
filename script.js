// script.js
document.addEventListener("DOMContentLoaded", function() {
    const text = "Reflections of (You)";
    let index = 0;
    const speed = 250; // Typing speed in milliseconds (slowed down)
    const delay = 3000; // Delay before starting the animation in milliseconds
    const textContainer = document.getElementById("animated-text");

    function type() {
        if (index < text.length) {
            textContainer.innerHTML += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }

    setTimeout(type, delay);

    // Check if the page is in an iframe or a portal
    if (window.self !== window.top) {
        document.body.classList.add('is-portal');
    }
});
