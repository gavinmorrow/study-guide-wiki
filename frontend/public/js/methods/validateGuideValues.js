/**
 * Validates the values of the create a new guide form.
 * @param { { title: string } } values The values of the form.
 * @returns { { title: string? } } The errors of the form, if any.
 */
const validateGuideValues = values => {
	const errors = {};

	if (values.title.length < 1) {
		errors.title = "Please enter a title.";
	}

	return errors;
};

export default validateGuideValues;
