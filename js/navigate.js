
// PAGINATION
var myResponse = new Array();
var pageList = new Array();
var currentPage = 1;
var numberPerPage = 200;
var numberOfPages = 0;

var button_icons = ['„', '‹', 'ˆ', "'", '~', '˛', '˝', '¸', '¯', '•', 'º', "˙", '«', '”', '¨', '˘'];

// MAKE THE QUERY
const urlParams = new URLSearchParams(window.location.search);
var queryValueCharacter = urlParams.get('ch');
var queryValueCluster = urlParams.get('cl');
fetch("https://panoramas-of-cinema.s3.eu-central-1.amazonaws.com/soms/" + queryValueCharacter + "/contour-rgb.json")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        myResponse = data[queryValueCluster];
        numberOfPages = Math.ceil(myResponse.length / numberPerPage);

        loadList();

        appendModal();

        // UPDATE NAVIGATION BAR
        if (queryValueCharacter[0] == '_') {
            document.getElementById('navResults').innerText = queryValueCharacter.toUpperCase().slice(1,) + ' | island ' + button_icons[queryValueCluster] + ' | ' + myResponse.length + ' images';
        } else {
            document.getElementById('navResults').innerText = queryValueCharacter.toUpperCase().split('_').join(' ') + ' | island ' + button_icons[queryValueCluster] + ' | ' + myResponse.length + ' images';
        }
        // show pagination
        if (myResponse.length > 200) {
            document.getElementsByClassName('pagination')[0].style.display = "block";
        } else {
            document.getElementsByClassName('pagination')[0].style.display = "none";
        }
    })

// PAGINATION
function nextPage() {
    currentPage += 1;
    loadList();
}
function previousPage() {
    currentPage -= 1;
    loadList();
}
function firstPage() {
    currentPage = 1;
    loadList();
}
function lastPage() {
    currentPage = numberOfPages;
    loadList();
}
function loadList() {
    var begin = ((currentPage - 1) * numberPerPage);
    var end = begin + numberPerPage;
    pageList = myResponse.slice(begin, end);
    appendMap();
    check();
}
function check() {
    document.getElementById("next").disabled = currentPage == numberOfPages ? true : false;
    document.getElementById("previous").disabled = currentPage == 1 ? true : false;
    document.getElementById("first").disabled = currentPage == 1 ? true : false;
    document.getElementById("last").disabled = currentPage == numberOfPages ? true : false;
}

// DISPLAY THE RESULTS
function appendMap() {
    // wipe container
    for (var i = 0; i < 4; i++) {
        document.getElementById('c' + i).innerText = '';
    }
    // update response based on request
    if (queryValueCharacter[0] == '_') {
        var data = pageList;
    } else {
        var data = [];
        for (var i = 0; i < pageList.length; i++) {
            data.push(["/" + queryValueCharacter, pageList[i]])
        }
    }

    for (var i = 0; i < pageList.length; i++) {
        // result container
        var resultCont = document.createElement("div");
        resultCont.className = "img_container";
        resultCont.setAttribute("id", "grid-item");

        // the image result
        var s3BucketName = "panoramas-of-cinema"
        var region_name = "eu-central-1"
        var objectKey = "frames_db" + data[i][0] + "/by_scene" + data[i][1];
        var frame_url = "https://" + s3BucketName + ".s3." + region_name + ".amazonaws.com/" + objectKey;

        var imgResult = document.createElement('img');
        imgResult.className = "img_response";
        imgResult.setAttribute('src', frame_url);
        imgResult.setAttribute('onclick', "onClick(this)");
        imgResult.setAttribute('data-movie', data[i][0]);
        imgResult.setAttribute('data-frame', data[i][1]);
        resultCont.appendChild(imgResult);

        // column placement
        document.getElementById('c' + (i % 4)).appendChild(resultCont);
    }
}

// CONSTRUCT MODAL
function appendModal() {
    // modal container
    var modalContainer = document.getElementById("myModals");

    // modal content
    var modalContent = document.createElement("div");
    modalContent.className = "modal";
    modalContent.setAttribute("id", "modal01");

    // close modal content
    function closeModalContent(element) {
        modalContent.style.display = "none";
        myVid.pause();
        myVid.style.display = "none";
        vidInfo.style.display = "none";
    }
    // close modal with X
    var closeBtn = document.createElement("span");
    closeBtn.className = "closeBtn";
    closeBtn.innerText = 'X';
    closeBtn.addEventListener("click", closeModalContent);
    // close modal with ESCAPE
    window.addEventListener('keydown', function (event) {
        if (event.key == 'Escape') {
            if (modalContent.style.display == "block") {
                closeModalContent();
            }
        }
    })
    modalContent.appendChild(closeBtn);

    // image
    var imgBig = document.createElement("img");
    imgBig.className = "modal-img";
    imgBig.setAttribute("id", "img01");
    modalContent.appendChild(imgBig);

    // image info
    var imgInfo = document.createElement("div");
    imgInfo.className = "info";
    imgInfo.setAttribute("id", "info01");
    modalContent.appendChild(imgInfo);

    // video btn
    var playVid = document.createElement("div");
    playVid.setAttribute("id", "playVid");
    playVid.innerText = "/ play";
    playVid.onclick = function () {
        myVid.style.display = "block";
        vidInfo.style.display = "block";
        let thisM = modalContent.dataset.movie.slice(1,);
        let thisF = modalContent.dataset.frame.slice(7, -4);
        let url = "https://clips.panoramasofcinema.ch/clip?movie=" + thisM + "&frame=" + thisF;

        fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                vidInfo.setAttribute('data-before', data['before']);
                vidInfo.setAttribute('data-after', data['after']);
                myVid.setAttribute('src', data['play']);
                myVid.play();
            })
    }
    modalContent.appendChild(playVid);

    // video 
    var myVid = document.createElement("video");
    myVid.setAttribute("id", "myVid");
    myVid.setAttribute('type', 'video/mp4');
    myVid.setAttribute('controls', '');
    modalContent.appendChild(myVid);

    // video info
    var vidInfo = document.createElement('div');
    vidInfo.className = "info";
    var vidInfoAfter = document.createElement('label');
    vidInfoAfter.innerHTML = "&nbsp;&nbsp; / +";

    vidInfoAfter.onclick = function () {
        myVid.setAttribute('src', vidInfo.dataset.after);
        myVid.play();
    }

    var vidInfoBefore = document.createElement('label');
    vidInfoBefore.innerText = "/ - ";
    vidInfoBefore.onclick = function () {
        myVid.setAttribute('src', vidInfo.dataset.before);
        myVid.play();
    }

    vidInfo.appendChild(vidInfoBefore);
    vidInfo.appendChild(vidInfoAfter);
    modalContent.appendChild(vidInfo);

    // tags username
    var userName = document.createElement("input");
    userName.className = "tagInput";
    userName.setAttribute("id", "usrName");
    userName.setAttribute("type", "text");
    userName.setAttribute("placeholder", "user name");
    modalContent.appendChild(userName);

    // tags tagname
    var tagName = document.createElement("input");
    tagName.className = "tagInput";
    tagName.setAttribute("id", "tagName");
    tagName.setAttribute("type", "text");
    tagName.setAttribute("placeholder", "tag name");
    modalContent.appendChild(tagName);

    // tags submit
    var tagBtn = document.createElement("span");
    tagBtn.setAttribute("id", "tagBtn");
    tagBtn.innerText = '/ add tag';
    tagBtn.onclick = function () {
        let tagUrl = "https://tags.panoramasofcinema.ch/tags";
        let thisUsr = document.querySelector("#usrName").value;
        let thisTag = document.querySelector("#tagName").value;
        let thisFrame = modalContent.dataset.movie + ',' + modalContent.dataset.frame;
        let thisR = tagUrl + '?action=ADD&tag=' + thisTag + '&user=' + thisUsr + '&frame=' + thisFrame;

        fetch(thisR)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                let r = data['statusCode'];
                if (r == 200) {
                    alert("tag added. aplausos");
                } else {
                    alert("error " + r);
                }
            })
    }
    modalContent.appendChild(tagBtn);

    modalContainer.appendChild(modalContent);
}

// OPEN MODAL
function onClick(element) {
    document.getElementById("modal01").setAttribute('data-movie', element.dataset.movie);
    document.getElementById("modal01").setAttribute('data-frame', element.dataset.frame);

    document.getElementById("img01").src = element.src.split('_thumbnail').join('');
    document.getElementById("info01").innerText = element.dataset.movie.slice(1,).split('_').join(' ').toUpperCase();

    document.getElementById("modal01").style.display = "block";
}