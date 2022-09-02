window.indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB;

window.IDBTransaction =
    window.IDBTransaction ||
    window.webkitIDBTransaction ||
    window.msIDBTransaction;
window.IDBKeyRange =
    window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.");
}

var db;
const request = window.indexedDB.open("media", 1);

request.onerror = function (event) {
    console.log("error: ", event);
};

request.onsuccess = function (event) {
    db = request.result;
    console.log("success: ", event);
};

request.onupgradeneeded = function (event) {
    var db = event.target.result;
    var objectStore = db.createObjectStore("media", { keyPath: "id" });
    objectStore.createIndex("id", "id", { unique: true });
    objectStore.createIndex("previewURL", "previewURL", { unique: false });
    objectStore.createIndex("largeImageURL", "largeImageURL", {
        unique: false,
    });
    objectStore.createIndex("imageURL", "imageURL", { unique: false });
    objectStore.createIndex("tags", "tags", { unique: false });
    objectStore.createIndex("user", "user", { unique: false });
    objectStore.createIndex("userImageURL", "userImageURL", { unique: false });
    objectStore.createIndex("likes", "likes", { unique: false });
    objectStore.createIndex("comments", "comments", { unique: false });
    objectStore.createIndex("views", "views", { unique: false });
    objectStore.createIndex("downloads", "downloads", { unique: false });
    objectStore.createIndex("fileBlob", "fileBlob", { unique: false });
};

async function saveMedia(media) {
    try {
        const card = document.getElementById(`searchResult_${media.id}`);
        card.childNodes[1].childNodes[3].innerHTML =
            '<div class="downloading"></div>';
        const mediaFetchResult = fetch(media.largeImageURL);
        const fileBlob = await mediaFetchResult.then((response) => {
            return response.blob();
        });
        console.log(fileBlob);
        media.fileBlob = fileBlob;

        var transaction = db.transaction(["media"], "readwrite");
        var objectStore = transaction.objectStore("media");
        var request = objectStore.put({
            id: media.id,
            previewURL: media.previewURL,
            largeImageURL: media.largeImageURL,
            pageURL: media.pageURL,
            tags: media.tags.split(","),
            user: media.user,
            userImageURL: media.userImageURL,
            likes: media.likes,
            comments: media.comments,
            views: media.views,
            downloads: media.downloads,
            fileBlob: media.fileBlob,
        });
        request.onsuccess = function (event) {
            console.log("success: ", event);
            card.childNodes[1].childNodes[3].innerHTML = `<img
                                src="./assets/downloaded-icon.svg"                                }
                                alt="Downloaded Photo"
                                height="20px"
                            />`;
        };
        request.onerror = function (event) {
            console.log("error: ", event);
        };
    } catch (error) {
        console.log(error);
    }
}

async function getAllMedia() {
    return new Promise(async (resolve, reject) => {
        try {
            if (!db) {
                // wait for db to be ready
                console.log("setting up db...");
                await new Promise((resolve) => {
                    setTimeout(resolve, 2000);
                });
            }

            const transaction = db.transaction(["media"], "readonly");
            const objectStore = transaction.objectStore("media");
            const request = objectStore.getAll();
            request.onsuccess = function (event) {
                resolve(event.target.result);
            };
            request.onerror = function (event) {
                console.log("error: ", event);
                reject(event);
            };
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

async function displayAllMedia() {
    const spinner = document.getElementsByClassName("spinner-wrapper")[0];
    spinner.style.display = "block";
    try {
        if (!db) {
            // wait for db to be ready
            await new Promise((resolve) => {
                setTimeout(resolve, 2000);
            });
        }
        const transaction = db.transaction(["media"], "readonly");
        const objectStore = transaction.objectStore("media");
        const request = objectStore.getAll();
        request.onsuccess = function (event) {
            console.log("success: ", event);
            const noDownloadsWrapper = document.getElementById(
                "no-downloads-wrapper"
            );

            const medias = event.target.result;
            if (!medias || !medias.length) {
                spinner.style.display = "none";

                noDownloadsWrapper.style.display = "flex";
                return;
            }
            medias.forEach((media) => {
                const blob = media.fileBlob;
                const url = URL.createObjectURL(blob);
                media.objectUrl = url;
            });

            const downloadedMediaWrapper = document.getElementById(
                "downloaded-media-wrapper"
            );

            const downloadedMedias = medias.map((media) => {
                const mediaDiv = document.createElement("div");
                mediaDiv.classList.add("downloaded-media");
                mediaDiv.id = "mediaDiv_" + media.id;
                mediaDiv.innerHTML = `
                    <div class="downloaded-media-icons-wrapper mid-box">
                        <div class="mid-box" onclick="deleteMedia('mediaDiv_${media.id}')">
                            <img
                                width="20px"
                                height="20px"
                                src="./assets/delete-icon.svg"
                                alt="Delete Media"
                            />
                        </div>
                        <div class="mid-box" onclick="openMediaInFullScreen('${media.id}')">
                            <img
                                width="20px"
                                height="20px"
                                src="./assets/full-screen-icon.svg"
                                alt="View in full screen"
                            />
                        </div>
                    </div>
                    <div class="downloaded-media-img">
                        <img
                            id="${media.id}"
                            src="${media.objectUrl}"
                            alt="Downloads Image"
                        />
                    </div>
                `;
                return mediaDiv;
            });
            spinner.style.display = "none";

            downloadedMediaWrapper.append(...downloadedMedias);
        };
        request.onerror = function (event) {
            console.log("error: ", event);
        };
    } catch (error) {
        console.log(error);
    }
}

async function deleteMedia(id) {
    const _id = parseInt(id.split("_")[1]);
    console.log("[deleteMedia] _id", _id, typeof _id);
    try {
        if (!db) {
            // wait for db to be ready
            console.log("setting up db...");
            await new Promise((resolve) => {
                setTimeout(resolve, 2000);
            });
        }

        const request = db
            .transaction(["media"], "readwrite")
            .objectStore("media")
            .delete(_id);
        request.onsuccess = function (event) {
            console.log("[deleteMedia] success", event);
            document.getElementById(id).remove();
        };

        request.onerror = function (event) {
            console.log("[deleteMedia] error in request", event);
        };
    } catch (error) {
        console.log("[deleteMedia] error->", error);
    }
}
