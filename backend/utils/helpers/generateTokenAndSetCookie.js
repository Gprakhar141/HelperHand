import jwt from 'jsonwebtoken'

const generateTokenAndSetCookie = (userId,res) => {
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn: '15d',
    })
    res.cookie("authToken",token,{
        httpOnly: true,//Not accesible through javascript by the browser(more secure)
        maxAge: 15 * 24 * 60 * 60 * 1000,   //15d
        sameSite: "strict", //CSRF(for security purposes)
    })

    return token;
}

export default generateTokenAndSetCookie;