/**
 * @typedef {object} GuideSectionData
 * @property {string} guideId The id of the guide this section belongs to.
 * @property {string} title The title of the guide section.
 * @property {object[]} paragraphs The content of the guide section.
 * @property {string} paragraphs.id The id of the paragraph.
 * @property {string} paragraphs.content The content of the paragraph. This is markdown.
 */

class GuideSection {
	/**
	 * All data for this guide section
	 * @type {GuideSectionData}
	 */
	#data;

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
	 * The content of the guide section.
	 * @type {object[]}
	 */
	get paragraphs() {
		return this.#data.paragraphs;
	}

	/** @param {GuideSectionData} data The data for this guide section. */
	constructor(data) {
		this.#data = data;
	}

	/**
	 * Returns a JSON representation of the guide section.
	 * @returns {GuideSectionData} The JSON representation of the guide section.
	 */
	toJSON() {
		return this.#data;
	}
}

module.exports = GuideSection;
