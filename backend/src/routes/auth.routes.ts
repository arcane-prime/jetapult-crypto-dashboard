import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { User, UserModel } from '../models/user-schema.js';
import { authMiddleware } from '../middleware/is-authenticated.js';

const router = express.Router();

// Step 1 redirec to google auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Step 2 google auth callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/', session: false }), (req, res) => {
    try { 
        const user = req.user as User;
        
        // Check if JWT_SECRET is set
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error('JWT_SECRET is not set in environment variables');
            return res.status(500).json({ error: 'Server configuration error: JWT_SECRET is missing' });
        }
        
        const token = jwt.sign({id: user.id, email: user.email}, jwtSecret, { expiresIn: '7d' });
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth-success?token=${token}`);
    } catch(err) { 
        console.error('Error in google auth callback', err);
        // Check if response hasn't been sent yet before redirecting
        if (!res.headersSent) {
            res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
        }
    }
});

router.get('/me', authMiddleware, async (req, res) => {
    try { 
        const decoded = req.user as { id: string; email: string };
        if(!decoded || !decoded.id) { 
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        // Fetch full user from database
        const user = await UserModel.findOne({ id: decoded.id });
        if(!user) { 
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json({success: true, user});
    } catch(err) { 
        console.error('Error in me route', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;