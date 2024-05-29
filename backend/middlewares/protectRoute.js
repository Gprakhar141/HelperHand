import User from "../models/userModel.js";
import jwt from 'jsonwebtoken';

const protectRoute = async(req,res,next) => {
    try {
        const token = req.cookies.authToken;

        if(!token) return res.status(401).json({message: "Unauthorised"})

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password")

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;

        next();
    } catch (error) {
        console.error("Error in protectRoute: ", error.message);
        if (!res.headersSent) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default protectRoute;