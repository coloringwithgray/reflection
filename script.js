//script.js
document.addEventListener("DOMContentLoaded", function() {
    const text = "Reflections of (You)";
    let index = 0;
    const speed = 250;
    const delay = 3000;
    const textContainer = document.getElementById("animated-text");

    function type() {
        if (index < text.length) {
            textContainer.innerHTML += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }

    setTimeout(type, delay);

    if (window.self !== window.top) {
        document.body.classList.add('is-portal');
    }

    const scrollPrompt = document.querySelector('.scroll-prompt');
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        if (scrollPosition > windowHeight / 2) {
            scrollPrompt.classList.add('visible');
        } else {
            scrollPrompt.classList.remove('visible');
        }
    });
});
