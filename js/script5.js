const songs = [
  {
    title: "Baby Came Home 2/Valentines",
    artist: "The Neighbourhood",
    src: "songs/baby_came_home.mp3",
    cover: "covers/sweater_heather.jpeg"
  },
  {
    title: "Daddy Issues",
    artist: "The Neighbourhood",
    src: "songs/daddy_issues.mp3",
    cover: "covers/sweater_heather.jpeg"
  },
  {
    title: "Reflections",
    artist: "The Neighbourhood",
    src: "songs/reflections.mp3",
    cover: "covers/sweater_heather.jpeg"
  },
  {
    title: "Sweater Weather",
    artist: "The Neighbourhood",
    src: "songs/sweater_heather.mp3",
    cover: "covers/sweater_heather.jpeg"
  }
];

document.addEventListener("DOMContentLoaded", function() {
    
let songIndex = 0;

const audio = document.getElementById("audio");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const cover = document.getElementById("cover");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const volume = document.getElementById("volume");

window.loadSong = function (song) {
  title.textContent = song.title;
  artist.textContent = song.artist;
  audio.src = song.src;
  cover.src = song.cover;
}

window.playSong = function() {
  audio.play();
  playBtn.innerHTML = '<span class="pause-icon">❚❚</span>';
}

window.pauseSong = function() {
  audio.pause();
  playBtn.innerHTML = '<span class="play-icon">▶</span>';
}

window.togglePlay = function() {
  if (audio.paused) {
    window.playSong();
  } else {
    window.pauseSong();
  }
}

function prevSong() {
  const wasPlaying = !audio.paused;
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songs[songIndex]);
  if (wasPlaying) playSong(); else pauseSong();
}

// Load initial song
window.loadSong(songs[songIndex]);

document.addEventListener('click', function(e) {
    if (
        e.target.tagName === 'BUTTON' && 
        e.target.classList.contains('btn-playlist') &&
        e.target.dataset.index
    ) {
        playFromPlaylist(e.target.dataset.index);
    }
})

function nextSong() {
  const wasPlaying = !audio.paused;
  songIndex = (songIndex + 1) % songs.length;
  loadSong(songs[songIndex]);
  if (wasPlaying) playSong(); else pauseSong();
}

const volumeSteps = [0.25, 0.5, 0.75, 1, 0]; // 0 is mute
let volumeIndex = 0;

document.getElementById("volumeCycleBtn").addEventListener("click", () => {
  volumeIndex = (volumeIndex + 1) % volumeSteps.length;
  const newVolume = volumeSteps[volumeIndex];
  audio.volume = newVolume;

  // Update volume icon
  const volumeIcon = document.getElementById("volumeCycleBtn");
  if (newVolume === 0) {
    volumeIcon.textContent = "🔇";
  } else if (newVolume <= 0.25) {
    volumeIcon.textContent = "🔈";
  } else if (newVolume <= 0.5) {
    volumeIcon.textContent = "🔉";
  } else {
    volumeIcon.textContent = "🔊";
  }
});
audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});

function updateProgress() {
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.value = percent || 0;
  currentTimeEl.textContent = formatTime(audio.currentTime);

  // Update background size to reflect progress visually
  progress.style.background = `linear-gradient(to right, #20c997 0%, #20c997 ${percent}%, #ccc ${percent}%, #ccc 100%)`;
}

function setProgress(e) {
  const percent = e.target.value;
  audio.currentTime = (percent / 100) * audio.duration;
}

function formatTime(time) {
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

// Event listeners
playBtn.addEventListener("click", togglePlay);
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);
audio.addEventListener("timeupdate", updateProgress);
progress.addEventListener("input", setProgress);
if (volume) {
    volume.addEventListener("input", (e) => {
        audio.volume = e.target.value;
    });
}
audio.addEventListener("ended", nextSong);


});

const playlistEl = document.getElementById("playlist");

for (let index = 0; index < songs.length; index++) {
    const song = songs[index];
    const li = document.createElement("li");
    li.classList.add("playlist-item");

    // Create elements manually instead of innerHTML
    const img = document.createElement("img");
    img.src = song.cover;
    img.alt = song.title;

    const infoDiv = document.createElement("div");
    infoDiv.classList.add("info");
    infoDiv.innerHTML = `<strong>${song.title}</strong><br><small>${song.artist}</small>`;

    const playButton = document.createElement("button");
    playButton.textContent = "▶";
    playButton.classList.add('btn-playlist');
    playButton.dataset.index = index;

    li.appendChild(img);
    li.appendChild(infoDiv);
    li.appendChild(playButton);
    playlistEl.appendChild(li);
}

// ✅ Fixed toggle here: Playlist to Now Playing
function playFromPlaylist(index) {
  songIndex = index;
  loadSong(songs[songIndex]);
  playSong();

  // Correct screen switch
  document.getElementById("playlistScreen").classList.remove("active");
  document.getElementById("nowPlayingScreen").classList.add("active");
}

// Navigate manually from Playlist to Now Playing
document.getElementById("goToPlayer").addEventListener("click", () => {
  document.getElementById("playlistScreen").classList.remove("active");
  document.getElementById("nowPlayingScreen").classList.add("active");
});

// Back button: Now Playing to Playlist
document.getElementById("backToPlaylist").addEventListener("click", () => {
    console.log("Back button clicked");
  document.getElementById("nowPlayingScreen").classList.remove("active");
  document.getElementById("playlistScreen").classList.add("active");
});