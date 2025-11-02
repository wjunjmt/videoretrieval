"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                // In a real app, you'd store the token in localStorage or cookies
                console.log("Login successful, token:", data.access_token);
                router.push('/'); // Redirect to home on successful login
            } else {
                setError('Invalid username or password.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="relative flex h-screen w-full flex-col bg-background-dark group overflow-hidden">
            <main className="flex h-full w-full">
                <div className="relative hidden lg:flex lg:w-3/5 xl:w-2/3 items-center justify-center p-12 overflow-hidden left-panel">
                    {/* ... (decorative part) */}
                </div>
                <div className="flex w-full lg:w-2/fiv xl:w-1/3 items-center justify-center p-8 sm:p-12 bg-form-bg-dark">
                    <div className="w-full max-w-md">
                        <form onSubmit={handleLogin}>
                            <div className="flex flex-col">
                                <h1 className="text-white tracking-light text-[32px] font-bold">Welcome Back</h1>
                                {error && <p className="text-red-500 mt-2">{error}</p>}
                                <div className="flex flex-col gap-4 py-3 mt-4">
                                    <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="form-input rounded-lg text-white bg-[#1b2327] h-14 p-4" />
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="form-input rounded-lg text-white bg-[#1b2327] h-14 p-4" />
                                </div>
                                <button type="submit" className="flex w-full h-12 items-center justify-center rounded-lg bg-primary text-white font-bold mt-4">
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
