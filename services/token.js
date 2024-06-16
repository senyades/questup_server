const dotenv = require('dotenv')
const jwt = require('jsonwebtoken');
const { Unauthorized, Forbidden } = require('../utils/errors');
dotenv.config()

class TokenService
{
    static async generateAccessToken(payload)
    {
        console.log("GenerateAccess:",process.env.ACESS_TOKEN_SECRET)
        return await jwt.sign(payload, process.env.ACESS_TOKEN_SECRET, {
            expiresIn: "30m",
        });
        
    }

    static async generateRefreshToken(payload)
    {
        return await jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: "15d",
        });
    }

    static async checkAccess(req, _, next)
    {
        
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')?.[1];

        if(!token)
        {
            return next (new Unauthorized());
        }

        try
        {
            req.user = await TokenService.verifyAccessToken(token);
            console.log(req.user);
        }
        catch(error)
        {
            console.log(error);
            return next(new Forbidden(error));
        }

        next();
    }

    static async verifyAccessToken(acessToken)
    {
        return await jwt.verify(acessToken, process.env.ACESS_TOKEN_SECRET);
    }

    static async verifyRefreshToken(refreshToken)
    {
        return await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    }
}

module.exports = TokenService;