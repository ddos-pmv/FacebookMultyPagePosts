export function openLoginPage() {
	chrome.tabs.create({
		active: true,
		url: "https://fruitful-plant.space/facebookLaravel/public",
	});
}
