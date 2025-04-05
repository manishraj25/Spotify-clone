
let currentSong = new Audio();


function secondsToMinutesSeconds(seconds) {
    // Calculate minutes and seconds
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Format minutes and seconds with leading zeros if necessary
    const formattedMinutes = (minutes < 10 ? '0' : '') + minutes;
    const formattedSeconds = (remainingSeconds < 10 ? '0' : '') + remainingSeconds;

    // Return formatted time
    return formattedMinutes + ':' + formattedSeconds;
}


let songs;
let currentFolder;

async function getSongs(folder) {
    currentFolder = folder;
    try {
        let response = await fetch(`http://127.0.0.1:5500/spotify/${currentFolder}/`);
        if (!response.ok) {
            throw new Error('Failed to fetch songs.');
        }
        let div = document.createElement("div");
        div.innerHTML = await response.text();
        let as = div.getElementsByTagName("a");

        songs = [];
        for (let index = 0; index < as.length; index++) {
            const element = as[index];
            if (element.href.endsWith(".mp3")) {
                songs.push(element.href.split(`/${currentFolder}/`)[1]);
            }
        }

        let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
        songul.innerText = "";
        for (const song of songs) {
            songul.innerHTML += `<li>
                <i class="fa-solid fa-music"></i>
                <div class="info">
                    <div>${song.replaceAll("%20", " ")}</div>
                    <div>Manish</div>
                </div>
                <i class="fa-solid fa-play"></i>
            </li>`;
        }

        Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
            e.addEventListener("click", () => {
                playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
            });
        });

        return songs;
    } catch (error) {
        console.error('Error fetching songs:', error.message);
        return [];
    }
}

    



const playMusic = (track, pause = false) => {
    // let audio = new Audio("/spotify/songs/" + track)
    currentSong.src = `/spotify/${currentFolder}/` + track;
    // console.log(currentSong.src)
    if (!pause) {
        currentSong.play();
        play.src = "pause.svg";
    }
    document.querySelector(".songname").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00/00:00";
}

async function main() {
    try{
    await getSongs("songs/mix");
    playMusic(songs[0], pause = true);




    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg";
        }
        else {
            currentSong.pause();
            play.src = "play.svg";
        }
    })

    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime,currentSong.duration)
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = currentSong.duration * percent / 100;
    })

 


    prev.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index - 1) >= 0) {
            currentSong.pause();
            playMusic(songs[index - 1]);
        }
    })

    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        // console.log(currentSong.src.split("/").slice(-1)[0],index) 
        if ((index + 1) < songs.length) {
            currentSong.pause();
            playMusic(songs[index + 1]);
        }
    })


    range.addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
        console.log(e.target.value);
    })

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        // console.log(e)
        e.addEventListener("click", async i => {
            // console.log(i.currentTarget.dataset.folder)
            songs = await getSongs(`songs/${i.currentTarget.dataset.folder}`);
        })
    })

}catch (error) {
    console.error('An error occurred:', error.message);
}
}

main()
