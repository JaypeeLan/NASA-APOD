"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const resultsNav = document.getElementById("resultsNav");
const favoritesNav = document.getElementById("favoritesNav");
const imagesContainer = document.querySelector(".images-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");
//NASA API
const count = 10;
const apiKey = "DEMO_KEY";
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;
let resultsArray = [];
let favorites = {};
// =========================//
// Scroll To Top, Remove Loader, Show Content
function showContent(page) {
    window.scrollTo({ top: 0, behavior: "auto" });
    loader.classList.add("hidden");
    if (page === "results") {
        resultsNav.classList.remove("hidden");
        favoritesNav.classList.add("hidden");
    }
    else {
        resultsNav.classList.add("hidden");
        favoritesNav.classList.remove("hidden");
    }
}
function createDOMNodes(page) {
    // Load ResultsArray or Favorites
    const currentArray = page === "results" ? resultsArray : Object.values(favorites);
    currentArray.forEach((result) => {
        // Card Container
        const card = document.createElement("div");
        card.classList.add("card");
        // Link
        const link = document.createElement("a");
        link.href = result.hdurl;
        link.title = "View Full Image";
        link.target = "_blank";
        // Image
        const image = document.createElement("img");
        image.src = result.url;
        image.alt = "NASA Picture of the Day";
        image.loading = "lazy";
        image.classList.add("card-img-top");
        // Card Body
        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        // Card Title
        const cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title");
        cardTitle.textContent = result.title;
        // Save Text
        const saveText = document.createElement("p");
        saveText.classList.add("clickable");
        if (page === "results") {
            saveText.textContent = "Add To Favorites";
            saveText.setAttribute("onclick", `saveFavorite('${result.url}')`);
        }
        else {
            saveText.textContent = "Remove Favorite";
            saveText.setAttribute("onclick", `removeFavorite('${result.url}')`);
        }
        // Card Text
        const cardText = document.createElement("p");
        cardText.textContent = result.explanation;
        // Footer Container
        const footer = document.createElement("small");
        footer.classList.add("text-muted");
        // Date
        const date = document.createElement("strong");
        date.textContent = result.date;
        // Copyright
        const copyrightResult = result.copyright === undefined ? "" : result.copyright;
        const copyright = document.createElement("span");
        copyright.textContent = ` ${copyrightResult}`;
        // Append
        footer.append(date, copyright);
        cardBody.append(cardTitle, saveText, cardText, footer);
        link.appendChild(image);
        card.append(link, cardBody);
        imagesContainer.appendChild(card);
    });
}
function updateDOM(page) {
    // Get Favorites from localStorage
    if (localStorage.getItem("nasaFavorites")) {
        favorites = JSON.parse(localStorage.getItem("nasaFavorites") || "");
    }
    // Reset DOM, Create DOM Nodes, Show Content
    imagesContainer.textContent = "";
    createDOMNodes(page);
    showContent(page);
}
// Get 10 images from NASA API
function getNasaPictures() {
    return __awaiter(this, void 0, void 0, function* () {
        // Show Loader
        loader.classList.remove("hidden");
        try {
            const response = yield fetch(apiUrl);
            resultsArray = yield response.json();
            updateDOM("results");
        }
        catch (error) {
            // Catch Error Here
        }
    });
}
// add result to favorite
function saveFavorite(itemUrl) {
    // title
    resultsArray.forEach((item) => {
        if (item.url.includes(itemUrl) && !favorites.hasOwnProperty(itemUrl)) {
            favorites[itemUrl] = item;
            //   show save confirmation for few secs
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 2000);
            //   save to local storage
            localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
        }
    });
}
// Remove item from Favorites
function removeFavorite(itemUrl) {
    if (favorites[itemUrl]) {
        delete favorites[itemUrl];
        // Set Favorites in localStorage
        localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
        updateDOM("favorites");
    }
}
getNasaPictures();
