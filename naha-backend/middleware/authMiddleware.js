import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Extract the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id) {
      return res.status(403).json({ message: "Forbidden: Invalid token payload" });
    }

    req.user = decoded.id;
    
    if (process.env.NODE_ENV === "development") {
      console.log("Decoded token:", decoded);
    }

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized: Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
    
    console.error("JWT Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default authMiddleware;
