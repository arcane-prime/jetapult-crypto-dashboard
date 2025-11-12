import { User, UserModel } from '../models/user-schema.js';

export async function getUserById(id: string): Promise<User | null> {
    try {
        const user = await UserModel.findOne({ id });
        return user;
    } catch (err) {
        console.error('Error getting user by id:', err);
        throw err;
    }
}

export async function addFavoriteCrypto(userId: string, cryptoId: string): Promise<string[]> {
    try {
        const user = await UserModel.findOne({ id: userId });
        if (!user) {
            throw new Error('User not found');
        }

        // Initialize favoriteCryptos if not present
        if (!user.favoriteCryptos) {
            user.favoriteCryptos = [];
        }

        // Add cryptoId to favorites if not already present
        if (!user.favoriteCryptos.includes(cryptoId)) {
            user.favoriteCryptos.push(cryptoId);
            user.updatedAt = new Date();
            await user.save();
        }

        return user.favoriteCryptos;
    } catch (err) {
        console.error('Error adding favorite crypto:', err);
        throw err;
    }
}

export async function removeFavoriteCrypto(userId: string, cryptoId: string): Promise<string[]> {
    try {
        const user = await UserModel.findOne({ id: userId });
        if (!user) {
            throw new Error('User not found');
        }

        // Remove cryptoId from favorites
        if (user.favoriteCryptos) {
            user.favoriteCryptos = user.favoriteCryptos.filter(id => id !== cryptoId);
            user.updatedAt = new Date();
            await user.save();
        }

        return user.favoriteCryptos || [];
    } catch (err) {
        console.error('Error removing favorite crypto:', err);
        throw err;
    }
}

