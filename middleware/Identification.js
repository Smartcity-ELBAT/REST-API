const jwt = require("jsonwebtoken");

module.exports.identification = async (req, res, next) => {
	const code = req.get("authorization");

	if (code !== undefined && code.includes("Bearer")) {
		const authCode = code.split(".")[1];

		try {
			req.session = jwt.verify(authCode, process.env.JWT_SECRET);
			next();
		} catch (e) {
			console.log(e);
			res.sendStatus(e instanceof jwt.TokenExpiredError ? 403 : (e instanceof jwt.JsonWebTokenError ? 401 : 500));
		}
	} else {
		res.sendStatus(401);
	}
}