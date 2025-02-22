document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const video = document.getElementById("video");
    const videoWrapper = document.querySelector(".video-wrapper");
    const playPauseBtn = document.getElementById("playPause");
    const volumeBtn = document.getElementById("volume");
    const volumeRange = document.getElementById("volumeRange");
    const fullscreenBtn = document.getElementById("fullscreen");
    const theaterModeBtn = document.getElementById("theaterMode");
    const darkModeBtn = document.getElementById("darkMode");
    const progressBar = document.getElementById("progressBar");
    const progressContainer = document.getElementById("progressContainer");
    const timeDisplay = document.getElementById("time");
    const rotateBtn = document.getElementById("rotateBtn");

    // State variables
    let currentRotation = 0;
    let isTheaterMode = false;
    let isDarkMode = true;
    let lastVolume = 1;
    video.volume = volumeRange.value;

    // Utility Functions
    const formatTime = seconds => {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Video Rotation Functions
    function calculateDimensions() {
        const videoAspect = video.videoWidth / video.videoHeight;
        const containerWidth = videoWrapper.offsetWidth;
        const containerHeight = videoWrapper.offsetHeight;

        if (currentRotation === 90 || currentRotation === 270) {
            if (videoAspect > 1) {
                // Landscape video rotated
                const newHeight = containerWidth;
                const newWidth = containerWidth * videoAspect;
                video.style.width = `${newWidth}px`;
                video.style.height = `${newHeight}px`;
            } else {
                // Portrait video rotated
                const newWidth = containerHeight * videoAspect;
                const newHeight = containerHeight;
                video.style.width = `${newWidth}px`;
                video.style.height = `${newHeight}px`;
            }
        } else {
            // Not rotated or 180 degrees
            video.style.width = '100%';
            video.style.height = '100%';
        }
    }

    function handleRotation() {
        currentRotation = (currentRotation + 90) % 360;
        
        // Remove all rotation classes
        video.classList.remove('video-rotate-0', 'video-rotate-90', 'video-rotate-180', 'video-rotate-270');
        videoWrapper.classList.remove('wrapper-rotated-90', 'wrapper-rotated-270');
        
        // Add new rotation class
        video.classList.add(`video-rotate-${currentRotation}`);
        
        // Add wrapper class for 90 and 270 degrees
        if (currentRotation === 90 || currentRotation === 270) {
            videoWrapper.classList.add(`wrapper-rotated-${currentRotation}`);
        }
        
        calculateDimensions();
        rotateBtn.innerHTML = currentRotation === 0 ? 
            '<i class="fas fa-sync-alt"></i>' : 
            '<i class="fas fa-undo"></i>';
    }

    // Play/Pause Functions
    const togglePlay = () => {
        if (video.paused) {
            video.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            video.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    };

    // Volume Functions
    const updateVolume = () => {
        video.volume = volumeRange.value;
        lastVolume = video.volume;
        const icon = video.volume === 0 ? 'fa-volume-mute' :
            video.volume < 0.5 ? 'fa-volume-down' : 'fa-volume-up';
        volumeBtn.innerHTML = `<i class="fas ${icon}"></i>`;
    };

    const toggleMute = () => {
        if (video.volume > 0) {
            lastVolume = video.volume;
            video.volume = 0;
            volumeRange.value = 0;
        } else {
            video.volume = lastVolume;
            volumeRange.value = lastVolume;
        }
        updateVolume();
    };

    // Progress Functions
    const updateProgress = () => {
        const percentage = (video.currentTime / video.duration) * 100;
        progressBar.style.width = `${percentage}%`;
        timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    };

    const setProgress = (e) => {
        const newTime = (e.offsetX / progressContainer.offsetWidth) * video.duration;
        video.currentTime = newTime;
    };

    // Fullscreen Functions
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            videoWrapper.requestFullscreen();
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            document.exitFullscreen();
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        }
    };

    // Theater Mode Functions
    const toggleTheaterMode = () => {
        isTheaterMode = !isTheaterMode;
        videoWrapper.classList.toggle('theater-mode');
        theaterModeBtn.innerHTML = isTheaterMode ?
            '<i class="fas fa-compress"></i>' : '<i class="fas fa-tv"></i>';
    };

    // Dark Mode Functions
    const toggleDarkMode = () => {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('light-mode');
        darkModeBtn.innerHTML = isDarkMode ?
            '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    };

    // Event Listeners
    playPauseBtn.addEventListener("click", togglePlay);
    video.addEventListener("click", togglePlay);
    volumeBtn.addEventListener("click", toggleMute);
    volumeRange.addEventListener("input", updateVolume);
    video.addEventListener("timeupdate", updateProgress);
    progressContainer.addEventListener("click", setProgress);
    fullscreenBtn.addEventListener("click", toggleFullscreen);
    theaterModeBtn.addEventListener("click", toggleTheaterMode);
    darkModeBtn.addEventListener("click", toggleDarkMode);
    rotateBtn.addEventListener("click", handleRotation);
    window.addEventListener("resize", calculateDimensions);
    video.addEventListener("loadedmetadata", calculateDimensions);

    // Handle fullscreen changes
    document.addEventListener("fullscreenchange", () => {
        if (!document.fullscreenElement && currentRotation !== 0) {
            currentRotation = 0;
            video.classList.remove('video-rotate-90', 'video-rotate-180', 'video-rotate-270');
            videoWrapper.classList.remove('wrapper-rotated-90', 'wrapper-rotated-270');
            video.classList.add('video-rotate-0');
            calculateDimensions();
        }
    });

    // Keyboard Controls
    document.addEventListener("keydown", (e) => {
        if (["Space", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)) {
            e.preventDefault();
        }

        switch (e.code) {
            case "Space":
                togglePlay();
                break;
            case "ArrowRight":
                video.currentTime = Math.min(video.duration, video.currentTime + 10);
                break;
            case "ArrowLeft":
                video.currentTime = Math.max(0, video.currentTime - 10);
                break;
            case "ArrowUp":
                volumeRange.value = Math.min(1, parseFloat(volumeRange.value) + 0.1);
                updateVolume();
                break;
            case "ArrowDown":
                volumeRange.value = Math.max(0, parseFloat(volumeRange.value) - 0.1);
                updateVolume();
                break;
            case "KeyF":
                toggleFullscreen();
                break;
            case "KeyR":
                handleRotation();
                break;
            case "KeyM":
                toggleMute();
                break;
        }
    });

    // Touch Controls
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    video.addEventListener("touchstart", (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
    });

    video.addEventListener("touchend", (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const touchEndTime = Date.now();

        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const deltaTime = touchEndTime - touchStartTime;

        // Tap for play/pause
        if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < 200) {
            togglePlay();
        }
        // Horizontal swipe for seeking
        else if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 30) {
            if (deltaX > 0) {
                video.currentTime = Math.min(video.duration, video.currentTime + 10);
            } else {
                video.currentTime = Math.max(0, video.currentTime - 10);
            }
        }
        // Vertical swipe for volume
        else if (Math.abs(deltaY) > 50 && Math.abs(deltaX) < 30) {
            if (deltaY < 0) {
                volumeRange.value = Math.min(1, video.volume + 0.1);
            } else {
                volumeRange.value = Math.max(0, video.volume - 0.1);
            }
            updateVolume();
        }
    });

    // Error handling
    video.addEventListener("error", () => {
        console.error("Video Error:", video.error);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("video");
    const homeButton = document.querySelector(".home-button");

    // Function to hide home button when video plays
    video.addEventListener("play", () => {
        homeButton.style.display = "none";
    });

    // Function to show home button when video pauses or ends
    video.addEventListener("pause", () => {
        homeButton.style.display = "flex";
    });

    video.addEventListener("ended", () => {
        homeButton.style.display = "flex";
    });
});
