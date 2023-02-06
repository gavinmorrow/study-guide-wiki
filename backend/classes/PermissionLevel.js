/**
 * A permission level.
 *
 * This is used to determine what a user can do with a guide.
 *
 * Levels (from least to most permissions):
 * - none: No access. They can't do anything, not even read.
 * - read: Read access. They can't make any changes.
 * - suggest: Suggest access. They can make changes, but they must be approved by someone with at least edit access.
 * - edit: Edit access. They can make changes, and they are automatically approved.
 * - manage: Manage access. They can manage the guide, such as adding and removing users.
 * - owner: Owner access. They can do anything, such as including adding/removing manage access.
 *
 * If a user has a level later in the list, they have all the permissions of levels earlier in the list.
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
			PermissionLevel.none,
			PermissionLevel.read,
			PermissionLevel.suggest,
			PermissionLevel.edit,
			PermissionLevel.manage,
			PermissionLevel.owner,
		];
	}

	/** No access. */
	static get none() {
		return new PermissionLevel("none");
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

	/** Owner access. */
	static get owner() {
		return new PermissionLevel("owner");
	}

	constructor(name) {
		this.name = name;
	}
}

module.exports = PermissionLevel;
