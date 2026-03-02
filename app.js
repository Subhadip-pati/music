const currentUser = JSON.parse(localStorage.getItem("user"));
let allUsers = JSON.parse(localStorage.getItem("users")) || [];

let userIndex = allUsers.findIndex(
    u => u.username === currentUser.username
);

let history = allUsers[userIndex].history || [];
let playlist = allUsers[userIndex].playlist || [];

document.getElementById("usernameDisplay").innerText = currentUser.username;

const historyList = document.getElementById("historyList");
const playlistList = document.getElementById("playlistList");

/* YOUTUBE PLAYER */
let player;
let isPlayerReady = false;

function onYouTubeIframeAPIReady() {
    player = new YT.Player("player", {
        height: "240",
        width: "100%",
        host: "https://www.youtube-nocookie.com",
        playerVars: { autoplay: 1, rel: 0 },
        events: { onReady: () => { isPlayerReady = true; } }
    });
}

function getVideoId(url) {
    const regExp = /(?:v=|\/)([0-9A-Za-z_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
}

function loadVideo(videoId) {
    if (!isPlayerReady) return alert("Player loading...");
    player.loadVideoById(videoId);
}

function playFromLink() {

    const url = document.getElementById("videoInput").value.trim();
    if (!url) return alert("Paste link");

    const videoId = getVideoId(url);
    if (!videoId) return alert("Invalid link");

    loadVideo(videoId);

    const song = {
        id: videoId,
        title: "YouTube Video",
        thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    };

    saveToHistory(song);
}

/* HISTORY */
function saveToHistory(song){

    if(!history.find(s=>s.id===song.id)){
        history.unshift(song);
        allUsers[userIndex].history = history;
        localStorage.setItem("users", JSON.stringify(allUsers));

        trackActivity("Played song");
        renderHistory();
    }
}

function renderHistory(){
    historyList.innerHTML = "";
    history.forEach(song=>{
        historyList.innerHTML += `
        <li>
            <img src="${song.thumbnail}" width="50">
            ${song.title}
            <button onclick="playAgain('${song.id}')">▶</button>
            <button onclick="addToPlaylist('${song.id}')">＋</button>
        </li>`;
    });
}

function playAgain(id){
    loadVideo(id);
}

/* PLAYLIST */
function addToPlaylist(id){

    const song = history.find(s=>s.id===id);

    if(!playlist.find(s=>s.id===id)){
        playlist.unshift(song);
        allUsers[userIndex].playlist = playlist;
        localStorage.setItem("users", JSON.stringify(allUsers));
        renderPlaylist();
    }
}

function renderPlaylist(){
    playlistList.innerHTML = "";
    playlist.forEach((song,index)=>{
        playlistList.innerHTML += `
        <li>
            <img src="${song.thumbnail}" width="40">
            ${song.title}
            <button onclick="playAgain('${song.id}')">▶</button>
            <button onclick="removePlaylist(${index})">❌</button>
        </li>`;
    });
}

function removePlaylist(index){
    playlist.splice(index,1);
    allUsers[userIndex].playlist = playlist;
    localStorage.setItem("users", JSON.stringify(allUsers));
    renderPlaylist();
}

/* ACTIVITY TRACK */
function trackActivity(action){
    let activity = JSON.parse(localStorage.getItem("activity")) || [];
    activity.unshift({
        username: currentUser.username,
        action,
        time: new Date().toLocaleString()
    });
    localStorage.setItem("activity", JSON.stringify(activity));
}

/* ADMIN PANEL */
if(currentUser.role === "admin"){

    document.getElementById("adminPanel").style.display = "block";

    let activity = JSON.parse(localStorage.getItem("activity")) || [];

    document.getElementById("totalUsers").innerText = allUsers.length;

    const userList = document.getElementById("allUsersList");
    allUsers.forEach(u=>{
        userList.innerHTML += `<li>${u.username} (${u.role})</li>`;
    });

    const activityList = document.getElementById("activityList");
    activity.forEach(a=>{
        activityList.innerHTML += `<li>${a.username} - ${a.action} - ${a.time}</li>`;
    });
}

/* CLEAR & LOGOUT */
function clearUserData(){
    history = [];
    playlist = [];
    allUsers[userIndex].history = [];
    allUsers[userIndex].playlist = [];
    localStorage.setItem("users", JSON.stringify(allUsers));
    renderHistory();
    renderPlaylist();
}

function logout(){
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

/* INIT */
renderHistory();
renderPlaylist();