const express = require("express");
const router = express.Router();

// Source: https://stackoverflow.com/a/15773824/15920018
// Remove trailing slashes
router.use((req, res, next) => {
	if (req.path.slice(-1) === "/" && req.path.length > 1) {
		const query = req.url.slice(req.path.length);
		const safepath = req.path.slice(0, -1).replace(/\/+/g, "/");
		res.redirect(301, safepath + query);
	} else {
		next();
	}
});

module.exports = router;
