import { openLoginPage } from "./functions/openLoginWebPage.js";

async function init() {
	document.querySelector(".btn__container").addEventListener("click", () => {
		window.open("https://fruitful-plant.space/facebookLaravel/public/");
	});
	const dataName = (await chrome.storage.local.get("name")).name;

	if (dataName) {
		const userName = dataName[0];
		document.querySelector(".user__text").textContent = userName;
		document.querySelector(".btn__text").textContent = "Log out";
		document.querySelector(".btn__img").src = "imgs/logout.png";
	} else {
		document.querySelector(".user__text").textContent = "User name";
		document.querySelector(".btn__img").src = "imgs/login.png";
		document.querySelector(".btn__text").textContent = "Log in";
	}
}
init();
