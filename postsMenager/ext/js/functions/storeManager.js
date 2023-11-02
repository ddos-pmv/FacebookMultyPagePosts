export const initializeUser = async (id) => {
	console.log("id", id);
	const userData = await getUserData(id);
	await chrome.storage.local.set(userData);
};
export const deleteUsersData = async () => {
	console.log("delete all data from store");
	chrome.storage.local.clear();
};

const getUserData = async (userId) => {
	return fetch(`https://fruitful-plant.space/facebookLaravel/public/getData`, {
		method: "POST",
		headers: {
			Accept: "application/json, application/xml, text/plain, text/html, *.*",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ id: userId }),
	}).then((response) => response.json());
};
