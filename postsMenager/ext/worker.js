import {
	initializeUser,
	deleteUsersData,
} from "./js/functions/storeManager.js";
chrome.cookies.onChanged.addListener((changeInfo) => {
	if (
		changeInfo.cookie.name == "id" &&
		changeInfo.cookie.domain == "fruitful-plant.space"
	) {
		if (!changeInfo.removed) {
			initializeUser(changeInfo.cookie.value);
		} else {
			deleteUsersData();
		}
	}
});
chrome.cookies.get(
	{ name: "id", url: "https://fruitful-plant.space/facebookLaravel" },
	(cookie) => {
		if (cookie) {
			initializeUser(cookie.value);
		} else {
			deleteUsersData();
		}
	}
);
chrome.runtime.onMessage.addListener((request) => {
	fetch(`https://fruitful-plant.space/facebookLaravel/public/publishPost`, {
		method: "POST",
		headers: {
			Accept: "application/json, application/xml, text/plain, text/html, *.*",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(request),
	});
});
