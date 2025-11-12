import { useAuthSuccess } from '../../hooks/useAuthSuccess';

export default function AuthSuccessPage() {
    useAuthSuccess();

    return (
        <div className="flex items-center justify-center h-screen">
            <h1 className="text-black">Authenticating...</h1>
            <p className="text-black">Please wait...</p>
        </div>
    );
}