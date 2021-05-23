let videoRecorder = document.querySelector("#record-video");
let captureBtn = document.querySelector("#capture-photo");
let videoElem = document.querySelector("#video-elem");
let timingELem = document.querySelector("#timing");
let clearObj;
let allFilters = document.querySelectorAll(".filter");
let uiFilter = document.querySelector(".ui-filter");
let filterColor = "";
let zoomInElem = document.querySelector("#plus-container");
let zoomOutElem = document.querySelector("#minus-conatiner");
let zoomLevel = 1;
let constraints = {
    video: true,
    audio: true
}
let recordState = false;
let mediaRecorder;
let buffer = [];
// local machine
navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (mediaStream) {
        // feed on UI
        videoElem.srcObject = mediaStream;
        // new object
        mediaRecorder = new MediaRecorder(mediaStream);
        mediaRecorder.addEventListener("dataavailable", function (e) {
            buffer.push(e.data);
        })
        mediaRecorder.addEventListener("stop", function () {
            // convert that data into a blob
            // mime type
            let blob = new Blob(buffer, { type: "video/mp4" });
            // blob convert -> url
            const url = window.URL.createObjectURL(blob);
            // download btn
            let a = document.createElement("a");
            // downoad
            a.download = "file.mp4";
            // url
            a.href = url;
            a.click();
            buffer = [];
        })
    }).catch(function (err) {
        console.log(err);
    })

videoRecorder.addEventListener("click", function () {
    if (!mediaRecorder) {
        alert("First allow permissions.");
        return;
    }
    if (recordState == false) {
        mediaRecorder.start();
        // videoRecorder.innerHTML = "Recording...";
        videoRecorder.classList.add("record-animation");
        // start time and show
        startCounting();
        recordState = true;
    } else {
        mediaRecorder.stop();
        // videoRecorder.innerHTML = "Record";
        videoRecorder.classList.remove("record-animation");
        // stop time and hide
        stopCounting();
        recordState = false;
    }
})
captureBtn.addEventListener("click", function () {
    // create a canvas element 
    // equal to your video frame
    let canvas = document.createElement("canvas");
    canvas.width = videoElem.videoWidth;
    canvas.height = videoElem.videoHeight;
    let tool = canvas.getContext("2d");
    captureBtn.classList.add("capture-animation");

    // scale(x,y) 
    tool.scale(zoomLevel, zoomLevel);
    let x = (canvas.width / zoomLevel - canvas.width) / 2;
    let y = (canvas.height / zoomLevel - canvas.height) / 2;
    // draw a frame on that canvas
    tool.drawImage(videoElem, x, y);


    // translucent filter color
    // drawn above photo
    if (filterColor) {
        tool.fillStyle = filterColor;
        tool.fillRect(0, 0, canvas.width, canvas.height);
    }
    // toDataURL
    let link = canvas.toDataURL();

    addMediaToDB("img", link);

    // // download
    // let anchor = document.createElement("a");
    // anchor.href = link;
    // anchor.download = "file.png";
    // anchor.click();
    // anchor.remove();
    // canvas.remove();

    // need one second of animation
    setTimeout(function () {
        captureBtn.classList.remove("capture-animation");
    }, 1000);
})

// function to start timer on click of record btn
function startCounting() {
    timingELem.classList.add("timing-active");
    let timeCount = 0;
    clearObj = setInterval(function () {
        let seconds = timeCount % 60 < 10 ? `0${timeCount % 60}` : `${timeCount % 60}`;
        let minutes = timeCount / 60 < 10 ? `0${Number.parseInt(timeCount / 60)}` : `${Number.parseInt(timeCount / 60)}`;
        let hours = timeCount / 3600 < 10 ? `0${Number.parseInt(timeCount / 3600)}` : `${Number.parseInt(timeCount / 3600)}`;
        timingELem.innerText = `${hours}:${minutes}:${seconds}`;
        timeCount++;
    }, 1000);
}

// function to stop timer on again click of record btn
function stopCounting() {
    timingELem.classList.remove("timing-active");
    timingELem.innerText = "00:00:00";
    clearInterval(clearObj);
}

// apply filter 
for (let i = 0; i < allFilters.length; i++) {
    allFilters[i].addEventListener("click", function () {
        // add filter to ui
        let color = allFilters[i].style.backgroundColor;
        console.log(color);
        if (color) {
            uiFilter.classList.add("ui-filter-active");
            uiFilter.style.backgroundColor = color;
            filterColor = color;
        } else {
            uiFilter.classList.remove("ui-filter-active");
            uiFilter.style.backgroundColor = "";
            filterColor = "";
        }
    })
}

// Zoom functionality
zoomInElem.addEventListener("click", function () {
    // console.log("Zoom In");
    if (zoomLevel < 3) {
        zoomLevel += 0.2;
        videoElem.style.transform = `scale(${zoomLevel})`;
    }
});
zoomOutElem.addEventListener("click", function () {
    // console.log("Zoom Out");
    if (zoomLevel > 1) {
        zoomLevel -= 0.2;
        videoElem.style.transform = `scale(${zoomLevel})`;
    }
});