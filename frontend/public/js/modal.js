class Modal extends HTMLElement {
	constructor() {
		super();

		// Shadow DOM
		let shadowRoot = this.attachShadow({ mode: "open" });
		/** @type HTMLTemplateElement */
		let template = document.getElementById("x-modal-template");
		shadowRoot.appendChild(template.content.cloneNode(true));
	}
	connectedCallback() {}
}
customElements.define("x-modal", Modal);
export default Modal;
