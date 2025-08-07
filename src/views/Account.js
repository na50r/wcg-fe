import AbstractView from "./AbstractView.js";
import * as UI from "../components/UI.js";
import { router } from "../main.js";
import { getAccount } from "../utils/Calls.js";
import { ImageSelector } from "../components/ImageSelector.js";
import { ChangePassword } from "../components/ChangeAccount.js";
import { Popup, loadData, cacheData, showAlert } from "../utils/Utility.js";
import { setEventListeners } from "../utils/EventHandling.js";


function renderTime(stamp) {
  const date = new Date(stamp);
  const localDate = date.toLocaleDateString();
  return localDate;
}

function renderImage(imageEnc, action = () => { }) {
  const img = new Image();
  img.alt = "Profile Picture";
  img.id = 'profile-pic'
  img.src = `data:image/jpeg;base64,${imageEnc}`;
  img.addEventListener('click', action);
  return img;
}

function renderAccount(data = {}, imgSelector) {
  const container = UI.Container();
  const h1 = UI.h1("Account");
  const img = renderImage(data.image, () => { Popup(imgSelector) });
  container.append(h1, img);
  const table = document.createElement("table");
  table.classList.add("account");

  const info = [
    { name: "Username", value: data.username },
    { name: "Wins", value: data.wins },
    { name: "Losses", value: data.losses },
    { name: "Registered At", value: renderTime(data.createdAt) },
    { name: "Profile Picture", value: data.imageName },
    { name: "Status", value: data.status },
  ]

  for (const item of info) {
    const row = UI.row([UI.column(item.name), UI.column(item.value)]);
    table.append(row);
  }

  container.append(table);
  return container;
}

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Account");
    this.username = params.username
  }

  async getHtml() {
    setEventListeners();
    const username = this.username
    const storedUsername = localStorage.getItem("username")
    if (username !== storedUsername) {
      showAlert("You are not allowed to view this page")
      router.navigateTo(`/account/${storedUsername}`)
      return;
    }
    if (loadData('account') === null) {
      const data = await getAccount(username)
      cacheData(data, 'account')
    }

    const data = loadData('account')
    const imgSelector = await ImageSelector();
    const changePassword = await ChangePassword();
    const container = document.createElement("div");
    const changePwButton = UI.actionButton("Change Password", () => {
      Popup(changePassword)
    });
    const acc = renderAccount(data, imgSelector);
    container.append(acc, changePwButton);
    return container;
  }
}