// script.js
document.addEventListener("DOMContentLoaded", function() {
    const text = "Reflections of (You)";
    let index = 0;
    const speed = 150; // Typing speed in milliseconds
    const delay = 1370; // Delay before starting the animation in milliseconds
    const textContainer = document.getElementById("animated-text");

    function type() {
        if (index < text.length) {
            textContainer.innerHTML += text.charAt(index) + "<br>";
            index++;
            setTimeout(type, speed);
        }
    }

    setTimeout(type, delay);
});
