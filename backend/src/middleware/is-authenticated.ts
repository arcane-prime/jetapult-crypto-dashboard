import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    // Check Authorization header first (Bearer token)
    const authHeader = req.headers.authorization;
    let token: string | undefined;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remove 'Bearer ' prefix
    }
    
    // Fallback to cookie if no Authorization header
    if (!token) {
        token = req.cookies?.token;
    }
    
    if(!token) { 
        console.error('No token found in request');
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        console.error('JWT_SECRET is not set in environment variables');
        return res.status(500).json({ message: 'Server configuration error' });
    }
    
    try {
        const decoded = jwt.verify(token, jwtSecret) as { id: string; email: string };
        req.user = decoded;
        next();
    } catch (error) {
        console.error('JWT verification failed:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
}