console.log('Spotify Clone - Fixed Version');

let currentSong = new Audio();
let songs = [];
let currFolder = "";

// Convert seconds → mm:ss
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// Fetch and display songs from a given folder
async function getSongs(folder) {
    currFolder = folder;
    let res = await fetch(`${folder}/`);
    let html = await res.text();

    let div = document.createElement("div");
    div.innerHTML = html;
    let as = div.getElementsByTagName("a");

    songs = [];
    for (let i = 0; i < as.length; i++) {
        const el = as[i];
        if (el.href.endsWith(".mp3")) {
            songs.push(el.href.split(`${folder}/`)[1]);
        }
    }

    // Show song list
    let songUL = document.querySelector(".songList ul");
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML += `
        <li>
            <img class="invert" width="34" src="img/music.svg" alt="">
            <div class="info">
                <div>${song.replaceAll("%20", " ")}</div>
                <div>Artist</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="img/play.svg" alt="">
            </div>
        </li>`;
    }

    // Click event for each song
    Array.from(document.querySelectorAll(".songList li")).forEach(e => {
        e.addEventListener("click", () => {
            playMusic(e.querySelector(".info div").innerText.trim());
        });
    });

    return songs;
}

// Play / Pause track
const playMusic = (track, pause = false) => {
    currentSong.src = `${currFolder}/${track}`;
    if (!pause) {
        currentSong.play();
        play.src = "img/pause.svg";
    }
    document.querySelector(".songinfo").innerText = decodeURI(track);
    document.querySelector(".songtime").innerText = "00:00 / 00:00";
};

// Display albums (each folder)
async function displayAlbums() {
    console.log("Loading albums...");
    let res = await fetch(`./songs/`);
    let html = await res.text();

    let div = document.createElement("div");
    div.innerHTML = html;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");
    cardContainer.innerHTML = "";

    let arr = Array.from(anchors);
    for (let i = 0; i < arr.length; i++) {
        const e = arr[i];
        if (e.href.includes("songs/") && !e.href.includes(".htaccess")) {
    let folder = e.href.split("songs/")[1].replace("/", "");


            try {
                let meta = await fetch(`songs/${folder}/info.json`);
                let data = await meta.json();

                cardContainer.innerHTML += `
                <div data-folder="${folder}" class="card">
                    <div class="play">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                                stroke-linejoin="round" />
                        </svg>
                    </div>
                    <img src="songs/${folder}/cover.jpg" alt="">
                    <h2>${data.title}</h2>
                    <p>${data.description}</p>
                </div>`;
            } catch (err) {
                console.warn(`⚠️ Missing info.json in ${folder}`);
            }
        }
    }

    // Play songs from clicked album
    Array.from(document.getElementsByClassName("card")).forEach(card => {
        card.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0]);
        });
    });
}

// Main
async function main() {
    // Folder names inside "songs/"
    let folders = [
        "angry_mood", "bright_mood", "chill_mood", "dark_mood",
        "diljit", "funky_mood", "happy_mood", "karan_aujla",
        "lofi", "love_mood", "uplift_mood"
    ];

    // Load default folder
    await getSongs(`songs/${folders[0]}`);
    playMusic(songs[0], true);

    // Show albums
    await displayAlbums();

    // Play / Pause button
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg";
        } else {
            currentSong.pause();
            play.src = "img/play.svg";
        }
    });

    // Update seekbar and time
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerText =
            `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left =
            (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    // Seek manually
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    // Hamburger menu toggle
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    // Previous / Next
    previous.addEventListener("click", () => {
        currentSong.pause();
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index > 0) playMusic(songs[index - 1]);
    });

    next.addEventListener("click", () => {
        currentSong.pause();
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index + 1 < songs.length) playMusic(songs[index + 1]);
    });

    // Volume range
    document.querySelector(".range input").addEventListener("change", e => {
        currentSong.volume = parseInt(e.target.value) / 100;
        if (currentSong.volume > 0) {
            document.querySelector(".volume img").src =
                document.querySelector(".volume img").src.replace("mute.svg", "volume.svg");
        }
    });

    // Mute / Unmute
    document.querySelector(".volume img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range input").value = 0;
        } else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentSong.volume = 0.1;
            document.querySelector(".range input").value = 10;
        }
    });
}

main();
