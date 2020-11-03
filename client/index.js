const dropzone = document.querySelector(".drop-zone");
const fileInp = document.querySelector("#fileInp");
const browse = document.querySelector(".browseBtn");
const bgprogress = document.querySelector(".bg-progress");
const percentDiv = document.querySelector("#percent");
const progressContainer = document.querySelector(".progress-container");
const uploading = document.querySelector(".uploading");
const downloadLink = document.querySelector("#fileURL");
const sharingContainer = document.querySelector(".sharing-container");
const copyBtn = document.querySelector("#copyBtn");
const emailForm = document.querySelector(".email-form");
const toast = document.querySelector(".toast");

const host = "https://webdrop-fileshare.herokuapp.com/";
const uploadURL = `${host}api/files`;
const emailURL = `${host}api/files/send`;

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
    if(fileInp.files.length > 1){
        fileInp.value = "";
        showToast("Upload 1 file at a time!");
        return;
    }
    const file = fileInp.files[0];
    if(file.size > (1000000 * 100)){
        fileInp.value = "";
        showToast("Upload Limit Exceeded [100MB]");
        return;
    }
    progressContainer.style.display = "block";
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("myfile", file);

    xhr.onreadystatechange = () => {
        if(xhr.readyState === XMLHttpRequest.DONE){
            const link = JSON.parse(xhr.response);
            console.log(link.file);
            emailForm[2].removeAttribute("disabled", "true");
            downloadLink.value = link.file;
            progressContainer.style.display = "none";
            sharingContainer.style.display = "block";
            copyBtn.addEventListener("click", () => {
                downloadLink.select();
                document.execCommand("copy");  
                showToast("Copied!");  
            })
        }
    }

    xhr.upload.onprogress = updateProgress;
    xhr.upload.onerror = () => {
        fileInp.value = "";
        showToast(`$Error in upload ${xhr.statusText}`)
    }
    xhr.open("POST", uploadURL);
    xhr.send(formData);
}

const updateProgress = (e) => {
    const percent = Math.round((e.loaded / e.total) * 100);
    if(percent === 100){
        uploading.innerText = "Uploaded"
        showToast("Uploaded");
    }
    bgprogress.style.width = `${percent}%`;
    percentDiv.innerText = percent;
}

emailForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const url = downloadLink.value;
    const formData = {
        uuid : url.split("/").splice(-1,1)[0],
        emailTo : emailForm.elements["to"].value,
        emailFrom : emailForm.elements["from"].value
    };
    emailForm[2].setAttribute("disabled", "true");
    console.table(formData);
    fetch(emailURL, {
        method : "POST",
        headers : {
            "Content-Type": "application/json"
        },
        body : JSON.stringify(formData)
    }).then(res => res.json())
      .then( ({success}) => {
        if(success){
            sharingContainer.style.display = "none";
            showToast("Email Sent!");
        }
    })
})

let toastTimer;
const showToast = (msg) => {
    toast.innerText = msg;
    toast.style.transform = "translate(-50%, 0)";
    clearTimeout(toastTimer);
    toastTimer = setTimeout( () => {
        toast.style.transform = "translate(-50%, 60px)";
    }, 2000)
}
