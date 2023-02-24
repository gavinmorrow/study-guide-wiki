/**
 * @typedef {object} GuideSectionData
 * @property {string} guideId The id of the guide this section belongs to.
 * @property {string} title The title of the guide section.
 * @property {string} content The content of the guide section. This is markdown.
 */

class GuideSection {
	/**
	 * All data for this guide section
	 * @type {GuideSectionData}
	 */
	#data = {};

	/**
	 * The id of the guide this section belongs to.
	 * @type {string}
	 */
	get guideId() {
		return this.#data.guideId;
	}

	/**
	 * The title of the guide section.
	 * @type {string}
	 */
	get title() {
		return this.#data.title;
	}

	/**
	 * The content of the guide section. This is markdown.
	 * @type {string}
	 */
	get content() {
		return this.#data.content;
	}

	constructor(guideId, title, content) {
		this.#data = { guideId, title, content };
	}
}

module.exports = GuideSection;
