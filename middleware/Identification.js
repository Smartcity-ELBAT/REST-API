const jwt = require("jsonwebtoken");

/**
 * @swagger
 *
 * components:
 *   responses:
 *     UnauthorizedJWT:
 *       description: JWT manquant ou expiré
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *             $ref: '#/components/schemas/WrongJWT'
 *
 *   schemas:
 *     WrongJWT:
 *       type: object
 *       oneOf:
 *         - $ref: '#/components/responses/MissingJWT'
 *         - $ref: '#/components/responses/ExpiredJWT'
 */

/**
 * @swagger
 * components:
 *  securitySchemes:
 *      bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 *  responses:
 *      ErrorJWT:
 *          description: Le JWT n'est pas valide
 *      MissingJWT:
 *          description: Le JWT n'est pas présent
 *      ExpiredJWT:
 *        description: Le JWT est expiré
 */


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
			res.sendStatus(e instanceof jwt.TokenExpiredError ? 401 : (e instanceof jwt.JsonWebTokenError ? 400 : 500));
		}
	} else {
		res.sendStatus(401);
	}
}