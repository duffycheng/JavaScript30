const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo(){
    navigator.mediaDevices.getUserMedia({video:true, audio:false})
        .then(localMediaStream => {
            console.log(localMediaStream);
            // covert to url and feed into video
            video.src = window.URL.createObjectURL(localMediaStream);
            video.play();
        })
        .catch(err=>{
            console.error(`no!!`, err);
        });
}

function paintToCanvas(){
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    return setInterval(()=>{
        ctx.drawImage(video, 0, 0, width, height);
        // huge array of RGBA data
        let pixels = ctx.getImageData(0,0,width,height);
        //take pixel out and put on effect
        // 變紅
        //pixels = redEffect(pixels);
        // rgb 分離
        //pixels = rgbSplit(pixels);
        // ghosting effect
        //ctx.globalAlpha = 0.1;
        // grren screen
        pixels = greenScreen(pixels);
        ctx.putImageData(pixels,0,0);
    },16);
}

// 以onclick 放在html上面
function takePhoto(){
    // snap sound
    snap.currentTime = 0;
    snap.play();
    //取得圖片資料 塞到下載
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('dowload', 'snapping');
    //link.textContent = 'Download Image';
    link.innerHTML = `<img src="${data}" alt="snap image">`;
    strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels){
    for(let i= 0,len=pixels.data.length;i<len;i+=4){
        pixels.data[i]   += 100;
        pixels.data[i+1] -= 50;
        pixels.data[i+2] *=.5;
    }
    return pixels;
}

function rgbSplit(pixels){
    for(let i= 0,len=pixels.data.length;i<len;i+=4){
        pixels.data[i - 150] = pixels.data[i+0];
        pixels.data[i + 100] = pixels.data[i+1];
        pixels.data[i - 150] = pixels.data[i+2];
    }
    return pixels;
}

function greenScreen(pixels){
    const levels = {};

    document.querySelectorAll('.rgb input').forEach((input) => {
        levels[input.name] = input.value;
    });

    for (i = 0; i < pixels.data.length; i = i + 4) {
        red = pixels.data[i + 0];
        green = pixels.data[i + 1];
        blue = pixels.data[i + 2];
        alpha = pixels.data[i + 3];

        if (red >= levels.rmin
            && green >= levels.gmin
            && blue >= levels.bmin
            && red <= levels.rmax
            && green <= levels.gmax
            && blue <= levels.bmax) {
            // take it out!
            pixels.data[i + 3] = 0;
        }
    }

    return pixels;
}

getVideo();

video.addEventListener("canplay",paintToCanvas);