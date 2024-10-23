// Paths to the .wav files for each piano version
const audioFiles = {
    piano1: 'piano1.wav',
    piano2: 'piano2.wav',
    piano3: 'piano3.wav',
    piano4: 'piano4.wav'
};

let currentAudio = new Audio(audioFiles.piano1);
let currentTime = 0;
let isPlaying = false;

// Get the elements from the DOM
const playPauseButton = document.getElementById('playPause');
const pianoSelect = document.getElementById('pianoSelect');
const restartButton = document.getElementById('restart');
const revealAnswerButton = document.getElementById('revealAnswer');
const answerKey = document.getElementById('answerKey');
const currentTimeDisplay = document.getElementById('currentTime');
const totalTimeDisplay = document.getElementById('totalTime');

// Function to format time in minutes:seconds
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Function to update the time display
function updateTimer() {
    currentTimeDisplay.textContent = formatTime(currentAudio.currentTime);
    totalTimeDisplay.textContent = formatTime(currentAudio.duration);
}

// Function to play or pause audio
function playPauseAudio() {
    if (isPlaying) {
        // Pause the current audio and save the current time
        currentAudio.pause();
        currentTime = currentAudio.currentTime;
        isPlaying = false;
        playPauseButton.textContent = 'Play';
    } else {
        // Resume playback from the saved time
        currentAudio.currentTime = currentTime;
        currentAudio.play();
        isPlaying = true;
        playPauseButton.textContent = 'Pause';
    }
}

// Function to switch between pianos while maintaining playback position
function switchPiano() {
    const selectedPiano = pianoSelect.value;
    currentTime = currentAudio.currentTime;  // Preserve the current time of the audio

    // Create a new audio element for the selected piano
    const newAudio = new Audio(audioFiles[selectedPiano]);
    newAudio.currentTime = currentTime;

    // Update the timer when the new audio is ready
    newAudio.addEventListener('timeupdate', updateTimer);
    newAudio.addEventListener('loadedmetadata', () => {
        updateTimer();
        if (isPlaying) {
            newAudio.play();  // Continue playing if it was already playing
        }
    });

    // Replace the current audio with the new one
    currentAudio.pause();  // Stop the old audio
    currentAudio = newAudio;
}

// Function to restart the audio playback
function restartAudio() {
    currentAudio.currentTime = 0;
    currentTime = 0;
    updateTimer();

    if (isPlaying) {
        currentAudio.play();  // Start playback if it was playing before
    }
}

// Function to reveal the answer key
function revealAnswer() {
    answerKey.classList.toggle('hidden');
    revealAnswerButton.textContent = answerKey.classList.contains('hidden') ? 'Reveal Answer' : 'Hide Answer';
}

// Add event listeners to the play/pause button, select dropdown, restart button, and reveal answer button
playPauseButton.addEventListener('click', playPauseAudio);
pianoSelect.addEventListener('change', switchPiano);
restartButton.addEventListener('click', restartAudio);
revealAnswerButton.addEventListener('click', revealAnswer);
currentAudio.addEventListener('timeupdate', updateTimer);
currentAudio.addEventListener('loadedmetadata', updateTimer);
