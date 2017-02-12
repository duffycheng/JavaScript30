let countdown;
const timerDisplay = document.querySelector(".display__time-left");
const endTimeDisplay = document.querySelector(".display__end-time");
const buttons = document.querySelectorAll('[data-time]');

function timer(seconds){
    // 取消計時器前確認是否要取消
    if(countdown && !window.confirm("Do you really want to reset timer?")){
        return;
    }else{
        clearInterval(countdown);
    }
    // 計算實際倒數結束時間
    const then = Date.now() + seconds * 1000;
    // 顯示剩多少時間
    displayTimeLeft(seconds);
    // 顯示結束時間為
    displayEndTime(then);
    countdown = setInterval(()=>{
        const secondLeft = Math.round((then - Date.now())/1000);
        // check if we should stop
        if(secondLeft < 0){
            clearInterval(countdown);
            return;
        }
        displayTimeLeft(secondLeft)
    },1000);
}

function displayTimeLeft(seconds){
    const minutes = Math.floor(seconds / 60);
    const reminderSeconds = seconds % 60;
    const displayTime = `${minutes}:${reminderSeconds<9?0:""}${reminderSeconds}`;
    document.title = displayTime;
    timerDisplay.textContent = displayTime;
}

function displayEndTime(timeStamp){
    const end = new Date(timeStamp);
    const hours = end.getHours();
    const minutes = end.getMinutes();
    endTimeDisplay.textContent = `Be Back at ${hours>12? hours -12:hours}:${minutes<10?"0":""}${minutes}${hours>12?  "PM":"AM"}`;
}

function startTimer(){
    timer(parseInt(this.dataset.time));
}

buttons.forEach(button => button.addEventListener('click',startTimer));

document.customForm.addEventListener("submit", function (e) {
    e.preventDefault();
    timer(parseInt(this.minutes.value)*60);
    //clear the minutes value
    this.reset();
});