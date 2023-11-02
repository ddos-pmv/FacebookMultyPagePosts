import { openLoginPage } from "../ui/js/functions/openLoginWebPage.js";

async function init() {
	const dataName = (await chrome.storage.local.get("name")).name;
	if (dataName) {
		const userName = dataName[0];
		document.querySelector("#app").textContent = userName;
	} else {
		console.log("go to login");
		document.querySelector("#app").textContent = "go to LOGIN";
		openLoginPage();
	}
}
init();
