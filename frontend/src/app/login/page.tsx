"use client";
import { useState } from 'react';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Placeholder for login logic
        console.log("Logging in with:", { username, password });
    };

    return (
        <div className="relative flex h-screen w-full flex-col bg-background-dark group overflow-hidden">
            <main className="flex h-full w-full">
                <div className="relative hidden lg:flex lg:w-3/5 xl:w-2/3 items-center justify-center p-12 overflow-hidden left-panel">
                    <div className="relative z-10 flex flex-col items-start text-white max-w-2xl">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="material-symbols-outlined text-primary text-5xl"> track_changes </span>
                            <h1 className="font-display text-4xl font-bold tracking-wider">天眼全域感知系统</h1>
                        </div>
                        <p className="font-display text-xl text-gray-300 leading-relaxed">
                            基于多模态大模型，融合视频内容识别、二次精准识别与ReID技术，实现人车轨迹的智能追踪与分析。
                        </p>
                    </div>
                </div>
                <div className="flex w-full lg:w-2/5 xl:w-1/3 items-center justify-center p-8 sm:p-12 bg-form-bg-dark">
                    <div className="w-full max-w-md">
                        <form onSubmit={handleLogin}>
                            <div className="flex flex-col">
                                <h1 className="text-white tracking-light text-[32px] font-bold leading-tight text-left pb-3 pt-6">欢迎回来</h1>
                                <p className="text-gray-400 mb-6">请输入您的凭据以继续</p>
                                <div className="flex max-w-[480px] flex-col gap-4 py-3">
                                    <label className="flex flex-col min-w-40 flex-1">
                                        <p className="text-gray-300 text-base font-medium leading-normal pb-2">用户名</p>
                                        <input
                                            className="form-input flex w-full min-w-0 flex-1 rounded-lg text-white focus:outline-none border border-[#3b4c54] bg-[#1b2327] focus:border-primary h-14 p-[15px]"
                                            placeholder="请输入用户名"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </label>
                                    <label className="flex flex-col min-w-40 flex-1">
                                        <p className="text-gray-300 text-base font-medium leading-normal pb-2">密码</p>
                                        <input
                                            type="password"
                                            className="form-input flex w-full min-w-0 flex-1 rounded-lg text-white focus:outline-none border border-[#3b4c54] bg-[#1b2327] focus:border-primary h-14 p-[15px]"
                                            placeholder="请输入密码"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </label>
                                </div>
                                <div className="flex py-3 mt-4">
                                    <button type="submit" className="flex w-full h-12 items-center justify-center rounded-lg bg-primary text-white font-bold">
                                        登录
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
