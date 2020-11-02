const dropzone = document.querySelector(".drop-zone");
const fileInp = document.querySelector("#fileInp");
const browse = document.querySelector(".browseBtn");
const bgprogress = document.querySelector(".bg-progress");
const percentDiv = document.querySelector("#percent");
const progressContainer = document.querySelector(".progress-container");
const uploading = document.querySelector(".uploading");

const host = "https://webdrop-fileshare.herokuapp.com/";
const uploadURL = `${host}api/files`;

dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    if(!dropzone.classList.contains("dragged")){
        dropzone.classList.add("dragged");
    }
})

dropzone.addEventListener("dragleave", (e) => {
    dropzone.classList.remove("dragged");
})

dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragged");
    uploading.innerText = "Uploading...";
    bgprogress.style.width = "0%";
    percentDiv.innerText = 0;
    const files = e.dataTransfer.files;
    if(files.length){
        fileInp.files = files;
        uploadFile();
    }
})

fileInp.addEventListener("change", () => {
    uploadFile();
})

browse.addEventListener("click", () => {
    fileInp.click();  
})


const uploadFile = () => {
    progressContainer.style.display = "block";
    const xhr = new XMLHttpRequest();
    const file = fileInp.files[0];
    const formData = new FormData();
    formData.append("myfile", file);

    xhr.onreadystatechange = () => {
        if(xhr.readyState === XMLHttpRequest.DONE){
            const link = JSON.parse(xhr.response);
            console.log(link.file);
            progressContainer.style.display = "none";
        }
    }

    xhr.upload.onprogress = updateProgress;

    xhr.open("POST", uploadURL);
    xhr.send(formData);
}

const updateProgress = (e) => {
    const percent = Math.round((e.loaded / e.total) * 100);
    if(percent === 100){
        uploading.innerText = "Uploaded"
    }
    bgprogress.style.width = `${percent}%`;
    percentDiv.innerText = percent;
}



