# Voice-Controlled Music Visualizer

A browser-based audio visualizer built with **p5.js**, **p5.sound**, and **p5.speech**. It plays an audio track (a default MP3 or one you upload), reacts to the audio's amplitude by animating a pulsing shape and a stream of particles, and lets you control the visualizer's **background color** and **particle shape** entirely with your **voice**.

## Live Demo

Open `index.html` in a browser (see [Usage](#usage) — it needs to be served over HTTP, not opened directly as a file).

## Features

- **Amplitude-reactive visuals** — a central shape pulses in size based on the real-time amplitude of the currently playing track (`p5.Amplitude`).
- **Particle system** — shapes continuously spawn from the center and drift outward, echoing the current shape choice.
- **Voice control** — using the Web Speech API via `p5.speech`, you can say:
  - **Colors:** "black", "white", "red", "blue", "green" → changes the background and the color theme.
  - **Shapes:** "circle", "square", "triangle", "pentagon" → changes the shape being drawn and generated as particles.
- **Custom audio upload** — upload your own audio file via the file picker; the visualizer will play and react to it instead of the bundled default track.
- **Playback controls** — Play/Pause and "Next Sound" buttons to toggle between the default track and an uploaded one.

## Contents

| File | Description |
|---|---|
| `index.html` | Page shell: loads p5.js, p5.sound, and p5.speech from CDNs, and the UI controls (file upload, play/pause, next sound). |
| `2.3.js` | All the sketch logic: audio loading/playback, amplitude analysis, particle system, speech recognition and command handling. |
| `Kalte_Ohren_(_Remix_).mp3` | Default bundled audio track. |

## How It Works

- **`preload()`** loads the default MP3 with p5's `loadSound`.
- **`setup()`** creates an 800×600 canvas, sets up a `p5.Amplitude` analyzer, and starts continuous speech recognition (`p5.SpeechRec`) with a callback (`gotSpeech`) that fires whenever a phrase is recognized.
- **`draw()`** runs every frame: it fills the background with the current color, spawns and updates `ShapeParticle` instances, and draws the central shape whose size is mapped from the live amplitude level (`amplitude.getLevel()`).
- **`gotSpeech()`** checks the recognized text for color and shape keywords and updates `bgColor`, `currentTheme`, and `currentShape` accordingly.
- **`handleFileUpload()`** lets you swap in your own audio file via `URL.createObjectURL`, loading it as a second track you can switch to.
- **Playback control functions** (`togglePlayPause`, `playNextSound`, `stopAllSongs`) manage which track is currently active and playing.
- **`ShapeParticle`** is a small class representing one particle: it spawns near the canvas center with a random outward velocity and is removed once it drifts off-screen.

## Usage

1. Serve the folder locally, for example:
   ```bash
   python3 -m http.server 8000
   ```
2. Open `http://localhost:8000/index.html` in your browser.
3. Allow microphone access when prompted (needed for voice control).
4. Click **Play** to start the default track, and try saying a color or shape name (e.g. "blue", "triangle") to change the visuals.
5. Optionally, use the file picker to upload your own audio file, then click **Next Sound** to switch to it.

## Skills Demonstrated

- Creative coding with p5.js and the p5.sound library
- Real-time amplitude analysis and audio-reactive animation
- Browser speech recognition (Web Speech API) integration
- Interactive front-end development (file upload, playback controls, canvas animation)
- Object-oriented JavaScript (particle system)
