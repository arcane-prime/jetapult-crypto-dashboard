import { User } from '../schema/user.schema.js';
import { getUserById, addFavoriteCrypto, removeFavoriteCrypto } from '../repositories/auth.repository.js';

export async function getUserFromDB(userId: string): Promise<User | null> {
    try {
        const user = await getUserById(userId);
        return user;
    } catch (err) {
        console.error('Error fetching user from DB:', err);
        return null;
    }
}

export async function addFavoriteCryptoToDB(userId: string, cryptoId: string): Promise<string[]> {
    try {
        const favoriteCryptos = await addFavoriteCrypto(userId, cryptoId);
        return favoriteCryptos;
    } catch (err) {
        console.error('Error adding favorite crypto to DB:', err);
        throw err;
    }
}

export async function removeFavoriteCryptoFromDB(userId: string, cryptoId: string): Promise<string[]> {
    try {
        const favoriteCryptos = await removeFavoriteCrypto(userId, cryptoId);
        return favoriteCryptos;
    } catch (err) {
        console.error('Error removing favorite crypto from DB:', err);
        throw err;
    }
}
