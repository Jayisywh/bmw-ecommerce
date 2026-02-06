import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({
      status: "fail",
      message: "Access denied and no token provided",
    });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // debug: log decoded token for troubleshooting
    // eslint-disable-next-line no-console
    console.log("[verifyToken] decoded token:", decoded);
    // token payloads may use `userId` (authController) or `id` in other places
    req.userId = decoded.userId || decoded.id;
    // also expose role if present
    req.userRole = decoded.role || null;
    // eslint-disable-next-line no-console
    console.log("[verifyToken] req.userId set to:", req.userId);
    next();
  } catch {
    return res.status(401).json({
      status: "fail",
      message: "Invalid or expire token",
    });
  }
};

export default verifyToken;
