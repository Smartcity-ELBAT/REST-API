const jwt = require("jsonwebtoken");


module.exports.identification = async (req, res, next) => {
	const headerAuth = req.get("Authorization");

	if (headerAuth !== undefined && headerAuth.includes("Bearer")) {
		const jwtToken = headerAuth.split(" ")[1];

		try {
			const decodedToken = jwt.verify(jwtToken, process.env.JWT_TOKEN);
			req.session = decodedToken.userData;
			req.session.authLevels = decodedToken.accessLevels;
			next();
		} catch (e) {
			console.log(e);
			res.sendStatus(e instanceof jwt.TokenExpiredError ? 403 : (e instanceof jwt.JsonWebTokenError ? 401 : 500));
		}
	} else {
		res.sendStatus(401);
	}
}