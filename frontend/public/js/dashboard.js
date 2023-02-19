const createGuideButton = document.getElementById("new-guide-button");
const modal = document.getElementById("create-guide-modal");
createGuideButton.addEventListener("click", () => {
	modal.showModal();
});
