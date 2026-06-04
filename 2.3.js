let song, userSong;
let amplitude;
let bgColor = 'white';
let currentShape = 'circle';
let speechRec;
let particles = [];
let isPlaying = false;
let currentSongIndex = 0; // 0: default, 1: user-uploaded
let songs = [];
let isLoading = false; // Track loading state

// Dynamic color themes for each background color
const colorThemes = {
    black: { small: '#AEC6CF', large: '#77DD77', text: '#FFFFFF' },
    white: { small: '#FFB347', large: '#779ECB', text: '#000000' },
    red:   { small: '#F49AC2', large: '#CFCFC4', text: '#FFFFFF' },
    blue:  { small: '#FFB3BA', large: '#FFDFBA', text: '#FFFFFF' },
    green: { small: '#CBAACB', large: '#FFFFBA', text: '#FFFFFF' }
};

let currentTheme = colorThemes.white;

function preload() {
    song = loadSound('Kalte_Ohren_(_Remix_).mp3', () => {
        console.log("Default song loaded");
        songs.push(song);
    }, () => {
        console.error("Failed to load default song");
        alert("Failed to load default audio file. Please ensure 'Kalte_Ohren_(_Remix_).mp3' is in the correct directory.");
    });
}

function setup() {
    createCanvas(800, 600);
    amplitude = new p5.Amplitude();
    
    speechRec = new p5.SpeechRec('en-US', gotSpeech);
    speechRec.continuous = true;
    speechRec.interimResults = false;
    speechRec.start(() => {
        console.log("Speech recognition started");
    }, () => {
        console.error("Failed to start speech recognition");
        alert("Speech recognition failed. Please ensure microphone access is granted.");
    });
    
    let playPauseButton = select('#play-pause');
    playPauseButton.mousePressed(togglePlayPause);
    let nextSoundButton = select('#next-sound');
    nextSoundButton.mousePressed(playNextSound);
    
    let audioUpload = select('#audio-upload');
    audioUpload.elt.addEventListener('change', handleFileUpload, false);
    
    // Start with default song if loaded
    if (songs.length > 0) {
        songs[0].play();
        isPlaying = true;
        playPauseButton.html('Pause');
        select('#status').html('Playing: Default Song');
    } else {
        console.error("No songs available to play");
        select('#status').html('No audio files loaded. Please upload an audio file.');
    }
}

function draw() {
    background(bgColor);
    
    // Generate particles
    for (let i = 0; i < 1; i++) {
        particles.push(new ShapeParticle(width / 2, height / 2, currentShape));
    }
    
    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].display();
        if (particles[i].isOffScreen()) {
            particles.splice(i, 1);
        }
    }
    
    // Draw central shape
    let level = amplitude.getLevel();
    let size = map(level, 0, 0.3, 150, 300);
    drawShape(width / 2, height / 2, size);
    
    // Draw instructions
    fill(currentTheme.text);
    noStroke();
    textSize(16);
    textAlign(CENTER, CENTER);
    text("Say: Black, White, Red, Blue, Green (Background)", width / 2, 30);
    text("Say: Square, Triangle, Circle, Pentagon (Shape)", width / 2, 60);
}

function drawShape(x, y, size) {
    noStroke();
    fill(currentTheme.large);
    if (currentShape === 'circle') {
        ellipse(x, y, size);
    } else if (currentShape === 'square') {
        rectMode(CENTER);
        rect(x, y, size, size);
    } else if (currentShape === 'triangle') {
        triangle(x, y - size / 2, x - size / 2, y + size / 2, x + size / 2, y + size / 2);
    } else if (currentShape === 'pentagon') {
        beginShape();
        for (let i = 0; i < 5; i++) {
            let angle = TWO_PI / 5 * i - PI / 2;
            let px = x + cos(angle) * size / 2;
            let py = y + sin(angle) * size / 2;
            vertex(px, py);
        }
        endShape(CLOSE);
    }
}

function gotSpeech() {
    let saidWord = speechRec.resultString.toLowerCase();
    
    // Background color recognition
    if (saidWord.includes("black")) {
        bgColor = "black";
        currentTheme = colorThemes[bgColor];
    } else if (saidWord.includes("white")) {
        bgColor = "white";
        currentTheme = colorThemes[bgColor];
    } else if (saidWord.includes("red")) {
        bgColor = "red";
        currentTheme = colorThemes[bgColor];
    } else if (saidWord.includes("blue")) {
        bgColor = "blue";
        currentTheme = colorThemes[bgColor];
    } else if (saidWord.includes("green")) {
        bgColor = "green";
        currentTheme = colorThemes[bgColor];
    }
    
    // Shape recognition
    if (saidWord.includes("square") && currentShape !== "square") {
        currentShape = "square";
        particles = [];
    } else if (saidWord.includes("triangle") && currentShape !== "triangle") {
        currentShape = "triangle";
        particles = [];
    } else if (saidWord.includes("circle") && currentShape !== "circle") {
        currentShape = "circle";
        particles = [];
    } else if (saidWord.includes("pentagon") && currentShape !== "pentagon") {
        currentShape = "pentagon";
        particles = [];
    }
}

function handleFileUpload(event) {
    let file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
        stopAllSongs();
        isLoading = true;
        select('#next-sound').attribute('disabled', true);
        select('#status').html('Loading audio, please wait...');
        let fileURL = URL.createObjectURL(file);
        userSong = loadSound(fileURL, () => {
            console.log("User song loaded");
            songs[1] = userSong; // Replace or set user song
            isLoading = false;
            select('#next-sound').removeAttribute('disabled');
            select('#status').html('Current Song: User Uploaded');
            if (isPlaying) {
                songs[1].play();
                currentSongIndex = 1;
                select('#play-pause').html('Pause');
            }
        }, () => {
            console.error("Failed to load user song");
            alert("Failed to load audio file. Please try another.");
            isLoading = false;
            select('#next-sound').removeAttribute('disabled');
            select('#status').html('Current Song: None');
        });
    } else {
        alert("Please upload a valid audio file.");
    }
}

function togglePlayPause() {
    let playPauseButton = select('#play-pause');
    if (isLoading) {
        alert("Audio is still loading. Please wait.");
        return;
    }
    if (!songs[currentSongIndex]) {
        alert("No song available to play.");
        return;
    }
    if (isPlaying) {
        stopAllSongs();
        isPlaying = false;
        playPauseButton.html('Play');
        select('#status').html('Current Song: Paused');
    } else {
        stopAllSongs();
        songs[currentSongIndex].play();
        isPlaying = true;
        playPauseButton.html('Pause');
        select('#status').html(currentSongIndex === 0 ? 'Playing: Default Song' : 'Playing: User Uploaded');
    }
}

function playNextSound() {
    if (isLoading) {
        alert("Audio is still loading. Please wait.");
        return;
    }
    if (songs.length === 0) {
        alert("No songs available.");
        return;
    }
    stopAllSongs();
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    if (songs[currentSongIndex]) {
        songs[currentSongIndex].play();
        isPlaying = true;
        select('#play-pause').html('Pause');
        select('#status').html(currentSongIndex === 0 ? 'Playing: Default Song' : 'Playing: User Uploaded');
    } else {
        alert("Selected song is not loaded. Please upload an audio file.");
        isPlaying = false;
        select('#play-pause').html('Play');
        select('#status').html('Current Song: None');
    }
}

function stopAllSongs() {
    songs.forEach((s, index) => {
        if (s && s.isPlaying()) {
            s.stop();
            console.log(`Stopped song at index ${index}`);
        }
    });
    isPlaying = false;
}

class ShapeParticle {
    constructor(x, y, shape) {
        let angle = random(TWO_PI);
        let distanceFromCenter = random(20, 50);
        this.x = x + cos(angle) * distanceFromCenter;
        this.y = y + sin(angle) * distanceFromCenter;
        this.shape = shape;
        this.size = random(20, 35);
        let speed = random(0.5, 1.5);
        this.speedX = cos(angle) * speed;
        this.speedY = sin(angle) * speed;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
    
    display() {
        push();
        fill(currentTheme.small);
        noStroke();
        if (this.shape === 'circle') {
            ellipse(this.x, this.y, this.size);
        } else if (this.shape === 'square') {
            rectMode(CENTER);
            rect(this.x, this.y, this.size, this.size);
        } else if (this.shape === 'triangle') {
            triangle(this.x, this.y - this.size / 2, this.x - this.size / 2, this.y + this.size / 2, this.x + this.size / 2, this.y + this.size / 2);
        } else if (this.shape === 'pentagon') {
            beginShape();
            for (let i = 0; i < 5; i++) {
                let angle = TWO_PI / 5 * i - PI / 2;
                let px = this.x + cos(angle) * this.size / 2;
                let py = this.y + sin(angle) * this.size / 2;
                vertex(px, py);
            }
            endShape(CLOSE);
        }
        pop();
    }
    
    isOffScreen() {
        return (this.x < -50 || this.x > width + 50 || this.y < -50 || this.y > height + 50);
    }
}