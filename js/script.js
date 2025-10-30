console.log('Spotify Clone - GitHub Compatible Version');

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

let albums = [
    {
        folder: "angry_mood",
        title: "Angry Mood",
        description: "Energetic & powerful beats",
        cover: "songs/angry_mood/cover.jpg",
        tracks: ["angry_mood.mp3"]
    },
    {
        folder: "bright_mood",
        title: "Bright Mood",
        description: "Feel the positivity",
        cover: "songs/bright_mood/cover.jpg",
        tracks: ["bright_mood.mp3"]
    },
    {
        folder: "chill_mood",
        title: "Chill Mood",
        description: "Relax with calm tunes",
        cover: "songs/chill_mood/cover.jpg",
        tracks: ["chill_mood.mp3"]   
    },
    {
        folder: "dark_mood",
        title: "Dark Mood",
        description: "Deep and mysterious vibes",
        cover: "songs/dark_mood/cover.jpg",
        tracks: ["dark_mood.mp3"]
    },
    {
        folder: "diljit",
        title: "Diljit",
        description: "Best of Diljit Dosanjh",
        cover: "songs/diljit/cover.jpg",
        tracks: ["diljit.mp3"]
    },
    {
        folder: "funky_mood",
        title: "Funky Mood",
        description: "Fun and dance hits",
        cover: "songs/funky_mood/cover.jpg",
        tracks: ["funky_mood.mp3"]
    },
    {
        folder: "happy_mood",
        title: "Happy Mood",
        description: "Joyful melodies",
        cover: "songs/happy_mood/cover.jpg",
        tracks: ["happy_mood.mp3"]
    },
    {
        folder: "karan_aujla",
        title: "Karan Aujla",
        description: "Top Karan Aujla tracks",
        cover: "songs/karan_aujla/cover.jpg",
        tracks: ["karan.mp3"]   
    },
    {
        folder: "lofi",
        title: "Lofi",
        description: "Peaceful background beats",
        cover: "songs/lofi/cover.jpg",
        tracks: ["lofi.mp3"]
    },
    {
        folder: "love_mood",
        title: "Love Mood",
        description: "Romantic tunes",
        cover: "songs/love_mood/cover.jpg",
        tracks: ["love_mood.mp3"]
    },
    {
        folder: "uplift_mood",
        title: "Uplift Mood",
        description: "Motivational vibes",
        cover: "songs/uplift_mood/cover.jpg",
        tracks: ["uplift_mood.mp3"]
    }
];


// Show album cards
function displayAlbums() {
    let cardContainer = document.querySelector(".cardContainer");
    cardContainer.innerHTML = "";

    albums.forEach(album => {
        cardContainer.innerHTML += `
        <div data-folder="${album.folder}" class="card">
            <div class="play">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                        stroke-linejoin="round" />
                </svg>
            </div>
            <img src="${album.cover}" alt="">
            <h2>${album.title}</h2>
            <p>${album.description}</p>
        </div>`;
    });

    // load songs from album
    Array.from(document.getElementsByClassName("card")).forEach(card => {
        card.addEventListener("click", e => {
            const albumFolder = e.currentTarget.dataset.folder;
            const albumData = albums.find(a => a.folder === albumFolder);
            loadSongs(albumData);
        });
    });
}

// Load and display songs
function loadSongs(album) {
    currFolder = album.folder;
    songs = album.tracks;

    let songUL = document.querySelector(".songList ul");
    songUL.innerHTML = "";

    for (const song of songs) {
        songUL.innerHTML += `
        <li>
            <img class="invert" width="34" src="img/music.svg" alt="">
            <div class="info">
                <div>${song}</div>
                <div>${album.title}</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="img/play.svg" alt="">
            </div>
        </li>`;
    }

    // Play songs by click
    Array.from(document.querySelectorAll(".songList li")).forEach(e => {
        e.addEventListener("click", () => {
            playMusic(e.querySelector(".info div").innerText.trim());
        });
    });

    // Auto-play first song
    playMusic(songs[0], true);
}

// Play and Pause
function playMusic(track, pause = false) {
    currentSong.src = `songs/${currFolder}/${track}`;
    if (!pause) {
        currentSong.play();
        play.src = "img/pause.svg";
    }
    document.querySelector(".songinfo").innerText = decodeURI(track);
    document.querySelector(".songtime").innerText = "00:00 / 00:00";
}

function main() {
    displayAlbums();

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

    // Hamburger menu
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    // Prev/Next buttons
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

    // Volume
    document.querySelector(".range input").addEventListener("change", e => {
        currentSong.volume = parseInt(e.target.value) / 100;
        if (currentSong.volume > 0) {
            document.querySelector(".volume img").src =
                document.querySelector(".volume img").src.replace("mute.svg", "volume.svg");
        }
    });

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
