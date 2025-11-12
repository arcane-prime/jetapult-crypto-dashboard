import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import type { VerifyCallback } from 'passport-google-oauth20';
import { UserModel } from '../schema/user.schema.js';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: `${process.env.BACKEND_URL || 'http://localhost:4000'}/auth/google/callback`,
}, async (accessToken, refreshToken, profile, done: VerifyCallback) => {
    try { 
        let user = await UserModel.findOne({ id: profile.id });
        
        if (user) {
            // Update existing user
            user.email = profile.emails?.[0]?.value || user.email;
            user.name = profile.displayName || user.name;
            user.avatar = (profile.photos?.[0]?.value as string) || user.avatar;
            user.updatedAt = new Date();
            user.isLoggedIn = true;
            user.isVerified = true;
            await user.save();
        }

        if(!user) { 
            user = await UserModel.create({
                id: profile.id,
                email: profile.emails?.[0]?.value || '',
                name: profile.displayName,
                avatar: profile.photos?.[0]?.value as string,
                createdAt: new Date(),
                updatedAt: new Date(),
                isLoggedIn: true,
                isVerified: true,
            })
        }

        return done(null, user);
    } catch(err) { 
        return done(err);
    }
}));