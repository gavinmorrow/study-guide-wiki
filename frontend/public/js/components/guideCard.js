import request from "../methods/request.js";

class GuideCard extends HTMLElement {
	/**
	 * The title of the guide.
	 * @type {string}
	 */
	title;

	/**
	 * Creates a new GuideCard.
	 * @param {string?} title The title of the guide. This will set the `data-title` attribute if it is not null. If it is null, the `data-title` attribute will be used instead. The `data-title` attribute will override the constructor.
	 */
	constructor(title) {
		super();

		this.title = title;

		// Shadow dom
		this.attachShadow({ mode: "open" });

		// Template
		const template = document.getElementById("guide-card-template");
		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}

	async connectedCallback() {
		// If the guideId is set in the attribute, use that
		// This overrides the constructor
		if (this.hasAttribute("data-title")) {
			this.title = this.getAttribute("data-title");
		} else if (this.title != null) {
			this.setAttribute("data-title", this.title);
		}

		// Ensure it was set somewhere
		if (this.title == null) {
			console.error("GuideCard: guideId is null");
			return;
		}

		// Ensure there is an id
		if (!this.hasAttribute("data-id")) {
			console.error("GuideCard: id is null");
			return;
		}

		// Update the elements
		const link = this.shadowRoot.getElementById("link");

		link.href = `/guide/${this.getAttribute("data-id")}`;
		link.setAttribute("aria-label", `${this.title}`);
		this.shadowRoot.getElementById("title").innerText = this.title;
	}
}

customElements.define("guide-card", GuideCard);
