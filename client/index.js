const dropzone = document.querySelector(".drop-zone");
const fileInp = document.querySelector("#fileInp");
const browse = document.querySelector(".browseBtn");

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
    const xhr = new XMLHttpRequest();
    const file = fileInp.files[0];
    const formData = new FormData();
    formData.append("myfile", file);

    xhr.onreadystatechange = () => {
        if(xhr.readyState === XMLHttpRequest.DONE){
            console.log(xhr.response);
        }
    }

    xhr.open("POST", uploadURL);
    xhr.send(formData);
}

