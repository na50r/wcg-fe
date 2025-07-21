import AbstractView from "./AbstractView.js";
import * as UI from "../components/UI.js";
import { router } from "../main.js";
import {account} from "../utils/Calls.js";
import { cacheAccount, loadAccount } from "../utils/Account.js";
import { ImageSelector } from "../components/ImageSelector.js";
import { ChangeUsername, ChangePassword } from "../components/ChangeAccount.js";

function renderTime(stamp) {
  const date = new Date(stamp);
  const localDate = date.toLocaleDateString();
  return localDate;
}

function renderImage(imageEnc, action=()=>{document.querySelector(".image-selector").classList.add("open")}) {
  const img = new Image();
  img.alt = "Profile Picture";
  img.id = 'profile-pic'
  img.src = `data:image/jpeg;base64,${imageEnc}`;
  img.addEventListener('click', action);
  return img;
}

function renderAccount(data = {}) {
  const container = UI.Container();
  const h1 = UI.h1("Account");
  const img = renderImage(data.image);
  container.append(h1, img);
  const table = document.createElement("table");
  table.classList.add("main-table");

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
    if (item.name === "Username") {
      row.addEventListener("click", () => {
        document.querySelector(".change-username").classList.add("open");
      });
    }
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
    const username = this.username
    const storedUsername = localStorage.getItem("username")
    if (username !== storedUsername) {
        alert("You are not allowed to view this page")
        router.navigateTo(`/account/${storedUsername}`)
        return;
    }
    if (loadAccount()=== null) {
      const data = await account(username)
      cacheAccount(data)
    }

    const data = loadAccount()
    const imgSelector = await ImageSelector();
    const changeUsername = ChangeUsername();
    const changePassword = await ChangePassword();
    const container = document.createElement("div");
    const changePwButton = UI.actionButton("Change Password", () => {
      document.querySelector(".change-password").classList.add("open");
    });
    const acc = renderAccount(data);
    container.append(imgSelector, changePassword, changeUsername, acc, changePwButton);
    return container;
  }
}