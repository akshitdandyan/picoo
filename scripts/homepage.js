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

//  <div class="card">
//                     <div class="card-header">
//                         <img
//                             src="https://cdn.pixabay.com/photo/2013/10/15/09/12/flower-195893_150.jpg"
//                             alt="IPIP"
//                         />
//                     </div>
//                     <div class="card-body">
//                         <div class="card-metrics mid-box">
//                             <div class="mid-box">
//                                 <img src="./assets/likes-icon.svg" />
//                                 <div class="metric-data">1800</div>
//                             </div>
//                             <div class="mid-box">
//                                 <img src="./assets/comments-icon.svg" />
//                                 <div class="metric-data">320</div>
//                             </div>
//                             <div class="mid-box">
//                                 <img src="./assets/views-icon.svg" />
//                                 <div class="metric-data">3402</div>
//                             </div>
//                             <div class="mid-box">
//                                 <img src="./assets/downloads-icon.svg" />
//                                 <div class="metric-data">500</div>
//                             </div>
//                         </div>
//                         <div class="card-user mid-box w-max">
//                             <img
//                                 src="https://cdn.pixabay.com/user/2013/11/05/02-10-23-764_250x250.jpg"
//                                 alt="User"
//                             />
//                             <div class="card-user-name">James Charles</div>
//                         </div>
//                         <div class="card-tags">#nature #flowers #awesome</div>
//                     </div>
//                 </div>

searchField.addEventListener("keypress", async function (e) {
    if (e.key !== "Enter") {
        return;
    }
    try {
        const searchTerm = e.target.value;
        const response = await fetch(getQueryUrl(searchTerm));
        const data = await response.json();
        const medias = data.hits;
        // create card for each media
        const cards = medias.map((media) => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <div class="card-header">
                    <img src="${media.previewURL}" alt="${media.tags}" />
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
                    <div class="card-tags">${media.tags}</div>
                </div>
            `;
            return card;
        });
        console.log(cards);
        searchResultsWrapper.append(...cards);
    } catch (error) {
        console.log("[searchField onchange] error", error);
    }
});
