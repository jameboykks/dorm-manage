
import { Router, Request, Response } from "express";
import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/login", authController.login);
router.post("/register", authController.register);

// Protected routes
router.get("/profile", authMiddleware.verifyToken, (req: Request, res: Response) => {
  res.json({ user: req.user });
});

router.get("/admin", authMiddleware.verifyToken, authMiddleware.isAdmin, (req: Request, res: Response) => {
  res.json({ message: "Admin access granted" });
});

export default router; 