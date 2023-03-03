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
// ----------------------------------------

function createDomElements() {
  resultsArray.forEach((result) => {
    const card = document.createElement("div");
    card.classList.add("card");

    // -----------------
    const link = document.createElement("a");
    link.href = result?.hdurl;
    link.title = "View full image";
    link.target = "_blank";

    // -------------------
    const image = document.createElement("img");
    image.src = result?.url;
    image.alt = "NASA picture of the Day";
    image.loading = "lazy";
    image.classList.add("card-img-top");

    // card body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    // card title
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = result?.title;

    // save text
    const saveText = document.createElement("p");
    saveText.classList.add("clickable");
    saveText.textContent = "Add to Favorites";
    saveText.setAttribute("onclick", `saveFavorite('${result.url}')`);

    // card text
    const cardText = document.createElement("p");
    cardText.textContent = result?.explanation;

    // footer container
    const footer = document.createElement("small");
    footer.classList.add("text-muted");

    // date
    const date = document.createElement("strong");
    date.textContent = result.date;

    // copyright
    const copyrightResult =
      result.copyright === undefined ? "" : result.copyright;
    const copyright = document.createElement("span");
    copyright.textContent = ` ${copyrightResult}`;

    // append
    footer.append(date, copyright);
    cardBody.append(cardTitle, saveText, cardText, footer);
    link.appendChild(image);
    card.append(link, cardBody);

    imagesContainer.appendChild(card);
  });
}

function updateDOM() {
  createDomElements();
}

// Get 10 images from NASA API
async function getNasaPictures() {
  try {
    const res = await fetch(apiUrl);
    resultsArray = await res?.json();
    updateDOM();
  } catch (error) {}
}

// add result to favorite
function saveFavorite(itemUrl) {
  // title
  resultsArray.forEach((item) => {
    if (item.url.includes(itemUrl) && !favorites.hasOwnProperty(itemUrl)) {
      favorites[itemUrl] = item.url;

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

getNasaPictures();
