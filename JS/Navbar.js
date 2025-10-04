const hoverSound = new Audio("src/Audio/ButtonHover.mp3");
const clickSound = new Audio("src/Audio/ButtonClick.mp3");
let waitTime = 300;

// Hamburger Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navLinks.contains(event.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
        
        // Close menu on window resize if screen becomes larger
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }
});

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