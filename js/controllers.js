
// MODAL : CONTROLLERS OPEN-CLOSE - - - - - - - - - - - - - - - - - - -
// search - day
var modalSearch = document.getElementsByClassName("modalSearch")[0];
function openModalSearch(element) {
    modalSearch.style.display = "block";
}
function closeModalSearch(element) {
    modalSearch.style.display = "none";
}
// navigate - night
var modalNavigate = document.getElementsByClassName("modalNavigate")[0];
function openModalNavigate(element) {
    //loadMap(this);
    modalNavigate.style.display = "block";
}
function closeModalNavigate(element) {
    modalNavigate.style.display = "none";
}
// my panoramas -
var modalMyPanoramas = document.getElementsByClassName("modalMyPanoramas")[0];
function openModalMyPanoramas(element) {
    modalMyPanoramas.style.display = "block";
}
function closeModalMyPanoramas(element) {
    modalMyPanoramas.style.display = "none";
}
// maps -
var modalMap = document.getElementsByClassName("modalMap")[0];
function openModalMap(element) {
    modalMap.style.display = "block";
}
function closeModalMap(element) {
    modalMap.style.display = "none";
}

// keyboard shortcuts
window.addEventListener('keydown', function (event) {
    // close modals
    if (event.key == 'Escape') {
        if (modalMap.style.display == "block") {
            closeModalMap();
        } else if (modalUrsTgs.style.display == "block") {
            closeModalUrsTgs();
        } else {
            closeModalSearch();
            closeModalNavigate();
            closeModalMyPanoramas();
        }
    }
    // open modals
    try {
        var modalContent = document.getElementById("modal01").style.display;
    } catch {
        var modalContent = "none";
    }
    try {
        var tagName = document.getElementById("tag").value.length;
    } catch {
        var tagName = tagName;
    }
    if (modalMap.style.display == "block" || modalUrsTgs.style.display == "block" ||
        modalSearch.style.display == "block" || modalNavigate.style.display == "block" ||
        modalMyPanoramas.style.display == "block" || modalContent == "block" || tagName > 0) {
    } else {
        if (event.key == 'S') {
            //console.log('hello');
            openModalSearch();
        }
        if (event.key == 'N') {
            openModalNavigate();
        }
        if (event.key == 'M') {
            openModalMyPanoramas();
        }
    }
})


// LOAD THE PLACES-OBJECTS-CHARACTERS-MOVIES INVENTORIES - - - - - - - - - - - - - - - - - - -
function appendList(data2App, listName) {
    var contList = document.getElementById(listName);
    for (var i = 0; i < data2App.length; i++) {
        var option = document.createElement("option");
        option.innerHTML = '<span>' + data2App[i] + '</span>';
        contList.appendChild(option);
    }
}

fetch("https://panoramas-of-cinema.s3.eu-central-1.amazonaws.com/indexes/videotheques_inv.json")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        appendList(data['places'].sort(), 'places_list');
        appendList(data['objects'].sort(), 'objects_list');
    })

fetch("https://panoramas-of-cinema.s3.eu-central-1.amazonaws.com/indexes/characters.json")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        appendList(Object.keys(data).sort(), 'characters_list');
    })

fetch("https://panoramas-of-cinema.s3.eu-central-1.amazonaws.com/indexes/videotheques_index.json")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log("Movies in PoC: " + data.index.length)
        appendList(data['index'].sort(), 'movies_list');
    })

// SEARCH BUTTON ; SEND TO 'SEARCH' PAGE
let searchBtn = document.getElementById('searchBtn');
searchBtn.onclick = function () {
    this_q = construct_query();
    if (this_q.length > 0) {
        let url = "search.html?q=" + this_q;
        window.open(url, '_self');
    } else {
        window.alert("check your levels");
    }
};

// NAVIGATE BUTTON ; OPEN MAP
let navigateBtn = document.getElementById('navigateBtn');
navigateBtn.onclick = function () {
    let oneCharacter = document.getElementById('characters_list').value;
    let oneMovie = document.getElementById('movies_list').value;
    if (oneCharacter == 0 && oneMovie == 0) {
        window.alert("select a character or movie to navigate.");
    } else if (oneCharacter != 0 && oneMovie != 0) {
        window.alert("select just one.");
    } else {
        if (oneCharacter == 0) {
            loadMap("/" + oneMovie);
        } else {
            loadMap("/_" + oneCharacter);
        }
    }
};

function construct_query() {
    let place = document.getElementById('places_list').value;
    let place_conf_min = document.getElementById('placesMin').value;
    let place_conf_max = document.getElementById('placesMax').value;
    let obj = document.getElementById('objects_list').value;
    let obj_conf_min = document.getElementById('objectsMin').value;
    let obj_conf_max = document.getElementById('objectsMax').value;
    let faces = document.getElementById('faces_list').value;
    var this_query = '';
    if (place != 0) {
        let placeConfMin = (place_conf_min / 100).toFixed(3);
        let placeConfMax = (place_conf_max / 100).toFixed(3);
        if (placeConfMin > placeConfMax) {
            return '';
        } else {
            this_query = this_query + 'places=' + place + ',' + placeConfMin + ',' + placeConfMax;
        }
    };
    if (obj != 0) {
        let objConfMin = (obj_conf_min / 100).toFixed(3);
        let objConfMax = (obj_conf_max / 100).toFixed(3);
        if (objConfMin > objConfMax) {
            return '';
        } else {
            this_query = this_query + '+objects=' + obj + ',' + objConfMin + ',' + objConfMax;
        }
    };
    this_query = this_query + '+faces=' + faces;
    return this_query;
};

// MODAL : USER NAMES - - - - - - - - - - - - - - - - - - -
// modal container
var modalUrsTgs = document.getElementsByClassName("modalUrsTgs")[0];

// modal close
function closeModalUrsTgs(element) {
    modalUrsTgs.style.display = "none";
    modalContent.innerText = '';
}
var closeBtn = document.createElement("span");
closeBtn.className = "closeBtn";
closeBtn.innerText = 'X';
closeBtn.addEventListener("click", closeModalUrsTgs);
modalUrsTgs.appendChild(closeBtn);

// modal content
var modalContent = document.createElement("div");
modalContent.className = "info";
modalUrsTgs.appendChild(modalContent);

// modal open
function doModalUsers(element) {
    modalUrsTgs.style.display = "block";
    fetch('https://tags.panoramasofcinema.ch/tags?action=GET_ALL_USERS')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            thisList = data['body'].sort();
            modalContent.innerText = thisList.join(' | ');
        })
}

function doMyPanoramas() {
    var thisUser = document.querySelector("#user-name").value;
    if (thisUser.length > 0) {
        this_request = 'action=GET_FRAMES_USER user=' + thisUser;
        let url = "myPanoramas.html?q=" + this_request + '&u=' + thisUser;
        window.open(url, '_self');
    } else {
        window.alert("type your user name");
    }
}

// FUNCTIONS : MODAL NAVIGATE - - - - - - - - - - - - - - - - - - -
function loadMap(thisMap) {
    // wipe container
    for (var i = 0; i < 4; i++) {
        document.getElementById('cMap' + i).innerText = '';
    }
    // 
    for (var i = 0; i < 16; i++) {
        // result container
        var resultCont = document.createElement("div");
        resultCont.className = "img_container";
        resultCont.setAttribute("id", "grid-item");
        document.getElementById('cMap' + (i % 4)).appendChild(resultCont);

        // the image result
        var s3BucketName = "panoramas-of-cinema"
        var region_name = "eu-central-1"
        var objectKey = "soms" + thisMap + "/" + i + ".jpg";
        var frame_url = "https://" + s3BucketName + ".s3." + region_name + ".amazonaws.com/" + objectKey;

        var imgResult = document.createElement('img');
        imgResult.className = "img_response";
        imgResult.setAttribute('src', frame_url);
        imgResult.setAttribute('style', "width:250px;");
        imgResult.setAttribute('onclick', "goNavigate(this)");
        imgResult.setAttribute('data-cluster', i);
        imgResult.setAttribute('data-character', thisMap.slice(1,));
        resultCont.appendChild(imgResult);
    }
    openModalMap();
}

function goNavigate(element) {
    let url = "navigate.html?ch=" + element.dataset.character + '&cl=' + element.dataset.cluster;
    window.open(url, '_self');
}
