// script.js
document.addEventListener("DOMContentLoaded", function() {
    const text = "Reflections of (You)";
    let index = 0;
    const speed = 150; // Typing speed in milliseconds
    const textContainer = document.getElementById("animated-text");

    function type() {
        if (index < text.length) {
            textContainer.innerHTML += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }

    type();
});
