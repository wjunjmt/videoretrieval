"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);

    const LoginForm = () => (
        <div id="login-form">
            <h1 className="text-white tracking-light text-[32px] font-bold">欢迎回来</h1>
            <p className="text-gray-400 mb-6">请输入您的凭据以继续</p>
            <div className="flex flex-col gap-4">
                <input placeholder="用户名" className="form-input rounded-lg text-white bg-[#1b2327] h-14 p-4 border border-[#3b4c54] focus:border-primary focus:ring-0" />
                <input type="password" placeholder="密码" className="form-input rounded-lg text-white bg-[#1b2327] h-14 p-4 border border-[#3b4c54] focus:border-primary focus:ring-0" />
            </div>
            <div className="flex justify-end mt-2">
                <a href="#" className="text-sm text-[#9cb0ba] hover:text-primary">忘记密码？</a>
            </div>
            <button className="w-full h-12 mt-6 bg-primary text-white font-bold rounded-lg hover:bg-primary/90">登录</button>
            <p className="text-center text-[#9cb0ba] text-sm mt-4">
                还没有账号？ <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(false); }} className="font-medium text-primary hover:underline">注册新账号</a>
            </p>
        </div>
    );

    const RegisterForm = () => (
        <div id="register-form">
            <h1 className="text-white tracking-light text-[32px] font-bold">创建新账号</h1>
            <div className="flex flex-col gap-4 mt-6">
                <input placeholder="用户名" className="form-input rounded-lg text-white bg-[#1b2327] h-14 p-4 border border-[#3b4c54] focus:border-primary focus:ring-0" />
                <input placeholder="电子邮箱" type="email" className="form-input rounded-lg text-white bg-[#1b2327] h-14 p-4 border border-[#3b4c54] focus:border-primary focus:ring-0" />
                <input type="password" placeholder="密码" className="form-input rounded-lg text-white bg-[#1b2327] h-14 p-4 border border-[#3b4c54] focus:border-primary focus:ring-0" />
                <input type="password" placeholder="确认密码" className="form-input rounded-lg text-white bg-[#1b2327] h-14 p-4 border border-[#3b4c54] focus:border-primary focus:ring-0" />
            </div>
            <button className="w-full h-12 mt-6 bg-primary text-white font-bold rounded-lg hover:bg-primary/90">注册</button>
            <p className="text-center text-[#9cb0ba] text-sm mt-4">
                已有账号？ <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(true); }} className="font-medium text-primary hover:underline">立即登录</a>
            </p>
        </div>
    );

    return (
        <div className="relative flex h-screen w-full bg-background-dark overflow-hidden">
            <main className="flex h-full w-full">
                <div className="relative hidden lg:flex lg:w-3/5 xl:w-2/3 items-center justify-center p-12 left-panel" style={{
                    backgroundImage: "radial-gradient(ellipse 80% 50% at 50% 120%, rgba(56, 189, 248, 0.2), transparent), linear-gradient(160deg, #0f172a 0%, #1e293b 50%, #030637 100%)"
                }}>
                    <div className="relative z-10 flex flex-col items-start text-white max-w-2xl">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="material-symbols-outlined text-primary text-5xl">track_changes</span>
                            <h1 className="font-display text-4xl font-bold tracking-wider">天眼全域感知系统</h1>
                        </div>
                        <p className="font-display text-xl text-gray-300 leading-relaxed">
                            基于多模态大模型，融合视频内容识别、二次精准识别与ReID技术，实现人车轨迹的智能追踪与分析。
                        </p>
                    </div>
                </div>
                <div className="flex w-full lg:w-2/5 xl:w-1/3 items-center justify-center p-8 sm:p-12 bg-form-bg-dark">
                    <div className="w-full max-w-md">
                        {isLogin ? <LoginForm /> : <RegisterForm />}
                    </div>
                </div>
            </main>
        </div>
    );
}
