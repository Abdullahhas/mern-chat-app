import jwt from 'jsonwebtoken';
export const genToken = (userId , res) => {
    const secret = 'mysceretkey';
    if (!secret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const token =  jwt.sign({userId}, secret, {
        expiresIn : '7d'
    })

    res.cookie('jwt' , token, {
        maxAge : 7*24*60*60*1000,
        httpOnly : true,
        sameSite : true,
        secure : process.env.NODE_ENV !== 'development'
    })

    return token;
}