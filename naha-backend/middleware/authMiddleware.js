import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "").trim();

  if (!token) {
    return res.status(403).json({ message: "Forbidden: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};

export default authMiddleware;
