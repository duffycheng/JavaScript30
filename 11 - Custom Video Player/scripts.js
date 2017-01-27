const player = document.querySelector(".player");
const video = player.querySelector(".viewer");
const progress = player.querySelector(".progress");
const progressBar = player.querySelector(".progress__filled");
const toggle = player.querySelector(".toggle");
const skipButtons = player.querySelectorAll("[data-skip]");
const ranges = player.querySelectorAll(".player__slider");
const fullscreen = player.querySelector(".fullscreen");

function togglePlay(){
    video[video.paused ? 'play': 'pause']();
    /** equal to
    if(video.paused){
        video.play();
    }else{
        video.pause();
    }
     */
}
function updateButton(){
    toggle.textContent = this.paused ?  '►' : '❚ ❚';
}
function skip(){
    video.currentTime += parseFloat(this.dataset.skip);
}
// 聲音 轉速
function handleRangeUpdate(){
    video[this.name] = this.value;
}
function handleProgress(){
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}
function scrub(e){
    const scrubTime = e.offsetX / progress.offsetWidth * video.duration;
    console.log(scrubTime);
    video.currentTime = scrubTime;
}

function toggleFullScreen(){
    player.classList.toggle('fullscreen');
}

video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);


toggle.addEventListener('click', togglePlay);
skipButtons.forEach(skipButton=>skipButton.addEventListener('click', skip));
ranges.forEach(range=>range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range=>range.addEventListener('mousemove', handleRangeUpdate));

let mouseDown = false;
progress.addEventListener('click',scrub);
progress.addEventListener('mousemove',(e)=>mouseDown && scrub(e));
progress.addEventListener('mousedown',()=>mouseDown = true);
progress.addEventListener('mouseup',()=>mouseDown = false);

fullscreen.addEventListener('click',toggleFullScreen);


