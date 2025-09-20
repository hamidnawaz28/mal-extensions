const $ = (s) => document.querySelector(s);
async function load() {
	const data = await new Promise((res) =>
		chrome.storage.local.get(["OPENAI_API_KEY", "OPENAI_MODEL"], res)
	);
	if (data.OPENAI_API_KEY) $("#apiKey").value = data.OPENAI_API_KEY;
	if (data.OPENAI_MODEL) $("#model").value = data.OPENAI_MODEL;
}
async function save() {
	const apiKey = $("#apiKey").value.trim();
	const model = $("#model").value.trim();
	await new Promise((res) =>
		chrome.storage.local.set(
			{ OPENAI_API_KEY: apiKey, OPENAI_MODEL: model },
			res
		)
	);
	const s = document.getElementById("saved");
	s.style.display = "inline";
	setTimeout(() => (s.style.display = "none"), 1200);
}
document.getElementById("save").addEventListener("click", save);
load();
