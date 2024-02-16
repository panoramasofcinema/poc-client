
// NAVIGATION BAR
// user name
var navUser = document.getElementById("navUser");
// results count
var navResults = document.getElementById("navResults");
// user/tag info
var navInfo = document.getElementById("navInfo");

// API QUERY
let urlParams = new URLSearchParams(window.location.search);
var queryValue = urlParams.get('q');
queryValue = queryValue.split(' ').join('&');

var userName = urlParams.get('u');
navUser.innerText = "hello "+userName;

var userTag = urlParams.get('t');
//console.log(userName);

let url = 'https://tags.panoramasofcinema.ch/tags?';
fetch(url+queryValue)
.then(function(response){
    return response.json();
})
.then(function(data){
    if (data.body.length == 0) {
        window.alert("nothing here. try another query");
    }
    appendInfo(data.body);
    appendData(data.body);
})

// DISPLAY THE INFO
function appendInfo(data){
    // the count
    navResults.innerText = 'you have '+data.length+' images here';

    // tags-users
    if (queryValue.includes('GET_FRAMES_USER&')){
        let thisTags = data.map(function(f){
            return f.tag;
        });
        let thisTagsU = [...new Set(thisTags)]
        navInfo.innerText = 'and '+thisTagsU.length + ' tags : '+ thisTagsU.sort().join(' . ');
    } else if (queryValue.includes('GET_FRAMES_TAG&')){
        let thisUsers = data.map(function(f){
            return f.user;
        });
        let thisUsersU = [...new Set(thisUsers)]
        navInfo.innerText = 'users with this tag : ' + thisUsersU.sort().join(' • ');
    }
}

// OPEN MODAL
function onClick(element) {
    document.getElementById("modal01").setAttribute('data-movie', element.dataset.movie);
    document.getElementById("modal01").setAttribute('data-frame', element.dataset.frame);

    document.getElementById("img01").src = element.src.split('_thumbnail').join('');
    document.getElementById("info01").innerText = element.dataset.movie.slice(1,).split('_').join(' ').toUpperCase();

    document.getElementById("modal01").style.display = "block";
}

// DISPLAY THE RESULTS
function appendData(data) {
	for (var i = 0; i < data.length; i++) {
        // result container
		var resultCont = document.createElement("div");
		resultCont.className = "img_container";
		resultCont.setAttribute("id", "grid-item");

        // the image result
        var s3BucketName = "panoramas-of-cinema"
        var region_name = "eu-central-1"
        var objectKey = "frames_db"+data[i].movie+"/by_scene"+data[i].frame;
        var frame_url = "https://"+s3BucketName+".s3."+region_name+".amazonaws.com/"+objectKey;

        var imgResult = document.createElement('img');
        imgResult.className = "img_response";
        imgResult.setAttribute('src', frame_url);
        imgResult.setAttribute('onclick', "onClick(this)");
        imgResult.setAttribute('data-movie', data[i].movie);
        imgResult.setAttribute('data-frame', data[i].frame);
        resultCont.appendChild(imgResult);

        // the image info
        var imgInfo = document.createElement('div');
        if(data[i].tag){
            imgInfo.innerText = 'tag: '+data[i].tag;
        } else {
            imgInfo.innerText = 'tag: '+userTag;
        }
        resultCont.appendChild(imgInfo);

        // delete tag label
        var delTag = document.createElement('div');
        delTag.className = "delete-tag";
        delTag.innerText = 'X';
        delTag.setAttribute('onclick', "deleteTag(this)");
        delTag.setAttribute('data-movie', data[i].movie);
        delTag.setAttribute('data-frame', data[i].frame);
        if(data[i].tag){
            delTag.setAttribute('data-tag', data[i].tag);
        } else {
            delTag.setAttribute('data-tag', userTag);
        }
        resultCont.appendChild(delTag);

        // column placement
		document.getElementById('c'+(i%4)).appendChild(resultCont);
	}

    // secondary container
    var secondContainer = document.getElementById("myModals");

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
    playVid.onclick = function() {
        myVid.style.display = "block";
        vidInfo.style.display = "block";
        let thisM = modalContent.dataset.movie.slice(1,);
        let thisF = modalContent.dataset.frame.slice(7,-4);
        let url = "https://clips.panoramasofcinema.ch/clip?movie="+thisM+"&frame="+thisF;
        
        fetch(url)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
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
    //vidInfo.className = "vidInfo";
    vidInfo.className = "info";

    var vidInfoAfter = document.createElement('label');
    vidInfoAfter.innerHTML = "&nbsp;&nbsp; / +";
    vidInfoAfter.onclick = function() {
        myVid.setAttribute('src', vidInfo.dataset.after);
        myVid.play();
    }

    var vidInfoBefore = document.createElement('label');
    vidInfoBefore.innerText = "/ - ";
    vidInfoBefore.onclick = function() {
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
    tagBtn.onclick = function() {
        let tagUrl = "https://tags.panoramasofcinema.ch/tags";
        let thisUsr = document.querySelector("#usrName").value;
        let thisTag = document.querySelector("#tagName").value; 
        let thisFrame = modalContent.dataset.movie+','+modalContent.dataset.frame;
        let thisR = tagUrl+'?action=ADD&tag='+thisTag+'&user='+thisUsr+'&frame='+thisFrame;
        
        fetch(thisR)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            let r = data['statusCode'];
            if (r == 200) {
                alert("tag added. aplausos");
            } else {
                alert("error " + r);
            }
        })
    }
    modalContent.appendChild(tagBtn);

    secondContainer.appendChild(modalContent);
}

// DELETE TAG
function deleteTag(element) {
    let goOn = confirm("you're about to delete this tag. are you sure ?");
    if (goOn == true){
        let tagUrl = "https://tags.panoramasofcinema.ch/tags";
        let thisFrame = element.dataset.movie+','+element.dataset.frame;
        let thisR = tagUrl+'?action=DELETE&tag='+element.dataset.tag+'&user='+userName+'&frame='+thisFrame;

        fetch(thisR)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            let r = data['statusCode'];
            if (r == 200) {
                alert("tag deleted");
            } else {
                alert("error " + r);
            }
        })
    }
}

function getTags(){
    var thisTag = document.querySelector("#tag").value;
    //console.log(thisTag)
    if (thisTag.length > 0){
        this_request = 'action=GET_FRAMES_USER_TAG tag='+thisTag+' user='+userName;
        let url = "myPanoramas.html?q="+this_request+'&u='+userName+'&t='+thisTag;
        window.open(url, '_self');
    } else {
        window.alert("type a tag");
    }
}
