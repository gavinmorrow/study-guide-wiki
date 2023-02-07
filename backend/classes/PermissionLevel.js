/**
 * A permission level.
 *
 * This is used to determine what a user can do with a guide.
 *
 * Levels (from least to most permissions):
 * - read: Read access. They can't make any changes.
 * - suggest: Suggest access. They can make changes, but they must be approved by someone with at least edit access.
 * - edit: Edit access. They can make changes, and they are automatically approved.
 * - manage: Manage access. They can manage the guide, such as adding and removing users.
 *
 * If a user has a level later in the list, they have all the permissions of levels earlier in the list.
 *
 * Owners have all permissions, and are not included in this list (because they are stored in the authorId column).
 */
class PermissionLevel {
	/**
	 * A list of all permission levels.
	 *
	 * A level later in the list has more permissions
	 * than a level earlier in the list.
	 */
	static get all() {
		return [
			PermissionLevel.read,
			PermissionLevel.suggest,
			PermissionLevel.edit,
			PermissionLevel.manage,
		];
	}

	/** Read access. */
	static get read() {
		return new PermissionLevel("read");
	}

	/** Suggest access. */
	static get suggest() {
		return new PermissionLevel("suggest");
	}

	/** Edit access. */
	static get edit() {
		return new PermissionLevel("edit");
	}

	/** Manage access. */
	static get manage() {
		return new PermissionLevel("manage");
	}

	/**
	 * The name of the permission level.
	 * @type {string}
	 */
	name;

	constructor(name) {
		this.name = name;
	}
}

module.exports = PermissionLevel;
