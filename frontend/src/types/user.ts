export interface User {
    id: string;
    email: string;
    name: string;
    avatar: string;
    createdAt: string;
    updatedAt: string;
    isLoggedIn: boolean;
    isVerified: boolean;
    favoriteCryptos?: string[]; // Array of crypto IDs
}