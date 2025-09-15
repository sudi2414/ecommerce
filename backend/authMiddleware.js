import JWT from 'jsonwebtoken';

export const requireSignIn = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization;
            const user = JWT.verify(token, process.env.JWT_SECRET);
            req.user = user;
            next();
        } else {
            return res.status(400).send({
                success: false,
                message: 'Authorization required'
            });
        }
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: 'Invalid token'
        });
    }
}