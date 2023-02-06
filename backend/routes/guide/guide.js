const GET_guide = (req, res) => {
    const guideId = req.params.id;
	const userId = req.userId;
	
	if (!guideId) {
		return res.sendStatus(400);
	}
};

const POST_guide = (req, res) => {};

const PUT_guide = (req, res) => {};

const DELETE_guide = (req, res) => {};

const ALL_guide = (req, res) => {
    const method = req.method;
    switch (method) {
        case "GET":
            return GET_guide(req, res);
        case "POST":
            return POST_guide(req, res);
        case "PUT":
            return PUT_guide(req, res);
        case "DELETE":
            return DELETE_guide(req, res);
        default:
            return res.sendStatus(405);
    }
};

module.exports = guide;
