const searchField = document.getElementById("search-field");
const searchResultsWrapper = document.getElementById("search-results-wrapper");

/**
 * @param query string
 * @param imageType "all", "photo", "illustration", "vector",  Default: "all"
 * @returns api url in string format
 */
const getQueryUrl = (query, imageType = "all") => {
    return `https://pixabay.com/api/?key=29508753-2172836f80dd24b14eff3a94e&q=${encodeURIComponent(
        query
    )}&image_type=${imageType}`;
};

async function getSearchResults() {
    try {
        const spinner = document.getElementsByClassName("spinner-wrapper")[0];
        spinner.style.display = "block";
        const searchTerm = searchField.value;
        const response = await fetch(getQueryUrl(searchTerm));
        const data = await response.json();
        const medias = data.hits;
        const downloadedMedias = await getAllMedia();
        console.log("downloadedMedias: ", downloadedMedias);
        // create card for each media
        const cards = medias.map((media) => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.id = id = `searchResult_${media.id}`;
            const alreadyDownloaded = downloadedMedias.find(
                (downloadedMedia) => downloadedMedia.id === media.id
            );
            console.log("alreadyDownloaded: ", alreadyDownloaded);

            card.innerHTML = `
                <div class="card-header">
                    <img src="${media.previewURL}" alt="${media.tags}" />
                    <div
                            class="download-action"
                            onclick='saveMedia(${JSON.stringify(media)})'
                        >
                            <img
                                src=${
                                    alreadyDownloaded
                                        ? "./assets/downloaded-icon.svg"
                                        : "./assets/download-action-icon.svg"
                                }
                                alt="Download Photo"
                                height="20px"
                            />
                        </div>
                </div>
                <div class="card-body">
                    <div class="card-metrics mid-box">
                        <div class="mid-box">
                            <img src="./assets/likes-icon.svg" />
                            <div class="metric-data">${media.likes}</div>
                        </div>
                        <div class="mid-box">
                            <img src="./assets/comments-icon.svg" />
                            <div class="metric-data">${media.comments}</div>
                        </div>
                        <div class="mid-box">
                            <img src="./assets/views-icon.svg" />
                            <div class="metric-data">${media.views}</div>
                        </div>
                        <div class="mid-box">
                            <img src="./assets/downloads-icon.svg" />
                            <div class="metric-data">${media.downloads}</div>
                        </div>
                    </div>
                    <div class="card-user mid-box w-max">
                        <img src="${media.userImageURL}" alt="User" />
                        <div class="card-user-name">${media.user}</div>
                    </div>
                    <div class="card-tags">${media.tags
                        .split(",")
                        .map((t) => " #" + t)}</div>
                </div>
            `;
            return card;
        });
        console.log(cards);
        searchResultsWrapper.innerHTML = "";
        searchResultsWrapper.append(...cards);
        spinner.style.display = "none";
    } catch (error) {
        console.log("[searchField onchange] error", error);
    }
}

searchField.addEventListener("keypress", async function (e) {
    if (e.key !== "Enter") {
        return;
    }
    getSearchResults();
});

async function updateTotalDownloads() {
    const totalDownloads = document.getElementById("totalDownloads");
    const medias = await getAllMedia();
    console.log("medias: ", medias);
    if (medias.length > 0) {
        totalDownloads.innerText = medias.length;
        console.log("totalDownloads: ", medias.length);
    }
}

updateTotalDownloads();
