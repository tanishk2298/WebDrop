const dropzone = document.querySelector(".drop-zone");

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
})