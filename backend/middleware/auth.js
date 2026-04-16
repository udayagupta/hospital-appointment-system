const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    console.log("Token received:", token);         // is token arriving?
  console.log("Secret:", process.env.JWT_SECRET); // is secret loading?

    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
         console.log("Decoded user:", req.user);
        next();
    } catch (error) {
        console.error("JWT Error:", error.message); 
        res.status(401).json({ message: "Invalid or expired token" });
    };
}

module.exports = protect;