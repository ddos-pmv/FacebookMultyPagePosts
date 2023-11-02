"use strict";
let url = window.location.href;

if (url.includes("facebook")) {
	//create new btn
	let myBtn = document.createElement("div");
	myBtn.textContent = "Publish for page(s)";
	myBtn.style.width = "100%";
	myBtn.style.height = "var(--button-height-medium)";
	myBtn.style.borderRadius = " var(--button-corner-radius)";
	myBtn.style.color = "var(--disabled-button-text)";
	myBtn.style.display = "flex";
	myBtn.style.flexDirection = "row";
	myBtn.style.justifyContent = "center";
	myBtn.style.alignItems = "center";
	myBtn.style.fontSize = ".9375rem";
	myBtn.style.fontFamily = "var(--font-family-segoe);";
	myBtn.style.fontWeight = "600";
	myBtn.style.userSelect = "none";
	myBtn.style.backgroundColor = "var(--disabled-button-background)";

	/*Настройки курсора */
	myBtn.addEventListener("mouseenter", () => {
		myBtn.style.cursor = "pointer";
		myBtn.style.opacity = "0.85";
	});

	myBtn.addEventListener("mouseleave", () => {
		myBtn.style.opacity = "1";
		myBtn.style.cursor = "default"; // Возвращаем обычный курсор при уходе с элемента
	});

	/*Обработка клика на "ОТправить позже" */
	myBtn.addEventListener("click", async () => {
		// console.log("clicked");
		if (checkMyBtnColor) {
			const data = await getData();
			// console.log(data);
			if (data.type != "feed") {
				let errorEl = document.createElement("h1");
				errorEl.style.color = "red";
				errorEl.style.padding = "0 16px";
				errorEl.textContent =
					"Sorry, we can't publish posts with pictures. Please, delete picture from your post.";
				document
					.querySelector(
						".x78zum5.xdt5ytf.x179dxpb.x1pl0jk3.x1n2onr6.x8n7wzh.x11pth41.xvue9z"
					)
					.appendChild(errorEl);
			} else {
				chrome.runtime.sendMessage(data);
				document.querySelector('span[data-lexical-text="true"]').textContent =
					"";
				document
					.querySelector(".xt7dq6l.x1a2a7pz.x6ikm8r.x10wlt62.x1n2onr6.x14atkfc")
					.querySelector("[aria-label='Close']")
					.click();
			}
		}
	});

	async function getData() {
		const userId = (await chrome.storage.local.get("userId")).userId;

		let pages = [];
		document.querySelectorAll(".pageRadio").forEach((radio) => {
			if (radio.checked) {
				pages.push(radio.value);
			}
		});

		let textInput;
		if (document.querySelector('span[data-lexical-text="true"]')) {
			textInput = document.querySelector(
				'span[data-lexical-text="true"]'
			).textContent;
		} else {
			textInput = "";
		}
		const dataType = document.querySelector(
			".x6s0dn4.x78zum5.xl56j7k.x6ikm8r.x10wlt62.x10l6tqk"
		)
			? "photos"
			: "feed";

		let data = {
			id: userId,
			type: dataType,
			pageId: pages,
			message: textInput,
		};
		if (dataType === "photos") {
			data.url = document
				.querySelector(".x6s0dn4.x78zum5.xl56j7k.x6ikm8r.x10wlt62.x10l6tqk")
				.querySelector("img").src;
		}
		return data;
	}

	function checkMyBtnColor() {
		let pages = [];
		document.querySelectorAll(".pageRadio").forEach((radio) => {
			if (radio.checked) {
				pages.push(radio.value);
			}
		});
		if (
			!document.querySelector(
				".x1n2onr6.x1ja2u2z.x78zum5.x2lah0s.xl56j7k.x6s0dn4.xozqiw3.x1q0g3np.xi112ho.x17zwfj4.x585lrc.x1403ito.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.xn6708d.x1ye3gou.xwcfey6.x1r1pt67"
			) &&
			pages.length > 0
		) {
			myBtn.style.color = "white";
			myBtn.style.backgroundColor = "rgb(236 173 0)";
			return true;
		} else {
			myBtn.style.backgroundColor = "var(--disabled-button-background)";
			myBtn.style.color = "var(--disabled-button-text)";
			return false;
		}
	}

	/*Функция добавления checkbox добавления  */
	async function appendLabels(btnsContainer) {
		let radioDiv = document.createElement("div");
		radioDiv.style.borderRadius = "4px";
		radioDiv.style.backgroundColor = "var(--card-background-flat)";
		let radioH1 = document.createElement("h1");
		radioH1.textContent = "Choose pages for publishing:";
		radioH1.style.widows = "100%";
		radioH1.classList.add("x1lkfr7t", "x1lbecb7", "xzsf02u", "xu06os2");
		radioH1.style.fontWeight = "500";
		radioDiv.appendChild(radioH1);
		radioDiv.style.display = "flex";
		radioDiv.style.flexDirection = "column";
		radioDiv.style.margin = "0 16px";
		radioDiv.style.marginTop = "6px";
		radioDiv.style.padding = "8px";

		await chrome.storage.local.get("pages", (response) => {
			response.pages.forEach((page) => {
				let label = document.createElement("label");
				label.textContent = page.name;
				label.style.display = "flex";
				label.style.flexDirection = "row-reverse";
				label.style.justifyContent = "flex-end";
				label.style.fontSize = ".9775rem";
				label.style.paddingBottom = "2px";
				label.for = page.name;

				let radioInput = document.createElement("input");
				radioInput.type = "checkBox";
				radioInput.name = "pageName";
				radioInput.id = page.name;
				radioInput.className = "pageRadio";
				radioInput.value = page.pageId;
				label.appendChild(radioInput);
				label.addEventListener("click", checkMyBtnColor);
				radioDiv.append(label);
			});
		});
		btnsContainer.parentNode.insertBefore(radioDiv, btnsContainer);
	}

	/*Обсервер формы и инжект кнопки с чекбоксами */
	const popupObserver = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.type == "childList") {
				mutation.addedNodes.forEach(async (node) => {
					if (node instanceof Element) {
						if (
							node.querySelector("form") ||
							node.tagName.toLowerCase() === "form"
						) {
							let btnsContainer = document.querySelector(
								"div.x6s0dn4.x9f619.x78zum5.x1qughib.x1pi30zi.x1swvt13.xyamay9.xh8yej3"
							);
							if (btnsContainer) {
								chrome.storage.local.get("name", (response) => {
									if (response.name) {
										btnsContainer.appendChild(myBtn);
										if (!btnsContainer.parentNode.querySelector(".pageRadio"))
											appendLabels(btnsContainer);
									}
								});
							}
						}
					}
				});
			} else if (mutation.type == "attributes") {
				if (mutation.target.tagName.toLowerCase() == "span") {
					checkMyBtnColor();
				}
			}
		});
	});

	//adding myBtn to form

	chrome.storage.local.get("name", (response) => {
		if (response.name) {
			popupObserver.observe(document.body, {
				childList: true,
				subtree: true,
				attributes: true,
			});
		}
	});
}
