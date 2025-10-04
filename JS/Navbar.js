const hoverSound = new Audio("src/Audio/ButtonHover.mp3");
const clickSound = new Audio("src/Audio/ButtonClick.mp3");
let waitTime = 300;

document.querySelectorAll(".nav-link a").forEach(link => {
    link.addEventListener("mouseenter", () => {
        hoverSound.currentTime = 0;
        hoverSound.play().catch(e => console.log("Hover sound error:", e));
    });
    link.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent immediate navigation
        clickSound.currentTime = 0;
        
        // Play the sound and wait for it to start before navigating
        clickSound.play().then(() => {
            // Wait a short time for the sound to be heard, then navigate
            setTimeout(() => {
                window.location.href = link.href;
            }, waitTime); // 150ms delay - adjust as needed
        }).catch(error => {
            console.log("Click sound error:", error);
            // If sound fails, navigate immediately
            window.location.href = link.href;
        });
    });
});



document.querySelectorAll(".social-link").forEach(link => {
    link.addEventListener("mouseenter", () => {
        hoverSound.currentTime = 0;
        hoverSound.play().catch(e => console.log("Social hover sound error:", e));
    });
    link.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent immediate navigation
        clickSound.currentTime = 0;
        
        // Play the sound and wait for it to start before navigating
        clickSound.play().then(() => {
            // Wait a short time for the sound to be heard, then navigate
            setTimeout(() => {
                window.location.href = link.href;
            }, waitTime); // 150ms delay - adjust as needed
        }).catch(error => {
            console.log("Social click sound error:", error);
            // If sound fails, navigate immediately
            window.location.href = link.href;
        });
    });
});