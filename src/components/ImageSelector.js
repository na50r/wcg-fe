import * as UI from "../components/UI.js";
import { getImages, changeImage } from "../utils/Calls.js";

function cacheImages(data) {
  localStorage.setItem("images", JSON.stringify(data))
}

function loadImages() {
  const images = localStorage.getItem("images")
  if (!images) return null;
  return JSON.parse(images)
}

export async function ImageSelector() {
  const username = localStorage.getItem("username")
  if (loadImages() === null) {
    const data = await getImages(username)
    cacheImages(data)
  }
  const data = loadImages()
  var selectedImage = null;
  const container = UI.Container();
  container.classList.add("image-selector");
  const table = document.createElement("table");
  for (const item of Object.values(data.names)) {
    const row = UI.row([UI.column(item)]);
    row.addEventListener("click", () => {
      if (selectedImage) {
        selectedImage.classList.remove("selected");
      }
      row.classList.add("selected");
      selectedImage = row;
    });
    table.append(row);
  }
  const scrollWrapper = document.createElement("div");
  scrollWrapper.classList.add("scroll-wrapper");
  scrollWrapper.append(table);
  container.append(scrollWrapper);
  const saveBtn = UI.actionButton("Save", () => {
    changeImage(selectedImage.innerText)
    container.classList.remove("open");
  });
  const canclBtn = UI.actionButton("Cancel", () => {
    container.classList.remove("open");
  });
  const btnBar = UI.buttonBar([saveBtn, canclBtn]);
  container.append(btnBar);
  return container;
}