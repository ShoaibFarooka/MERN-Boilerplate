import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import User from '../models/userModel';
import * as authUtils from '../utils/authUtils';

interface CustomJwtPayload extends JwtPayload {
  id: string;
  name: string;
  role: string;
}

const authenticateRequest = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      res.status(401).json({ error: "Invalid or missing token!" });
      return;
    }

    const payload = authUtils.verifyAccessToken(token);
    if (!payload) {
      res.status(401).json({ error: "Invalid or missing token!" });
      return;
    }

    req.user = payload as CustomJwtPayload;
    next();

  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Token verification failed!" });
  }
};

const verifyRole = (requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const user = await User.findById(userId);

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      if (!requiredRoles.includes(user.role)) {
        res.status(403).json({ error: 'Insufficient role' });
        return;
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
};

export {
  authenticateRequest,
  verifyRole
};
