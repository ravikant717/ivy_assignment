"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { IvyLogo } from "@/components/common/ivy-logo";

interface LoginFormProps {
    className?: string;
    onSuccess?: () => void;
}

export function LoginForm({ className = "", onSuccess }: LoginFormProps) {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Invalid email or password");
            }

            if (onSuccess) {
                onSuccess();
            } else {
                router.push("/dashboard");
                router.refresh();
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    const fillDemoCredentials = () => {
        setEmail("demo1@ivy.homes");
        setPassword("b43deecd5d");
    };

    return (
        <div className={`w-full max-w-[380px] mx-auto ${className}`}>
            {/* Mobile brand header */}
            <div className="mb-6 flex items-center lg:hidden">
                <IvyLogo className="h-7 w-auto" />
            </div>

            {/* Title & subtitle */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-[#111827]">
                    Welcome back
                </h1>
                <p className="mt-2 text-sm text-[#6b7280]">
                    Sign in to continue to Ivy Homes
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="space-y-1.5">
                    <label
                        htmlFor="email"
                        className="block text-xs font-semibold tracking-wide text-[#1f2937]"
                    >
                        Email or username
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="e.g. arjun@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-11 w-full rounded-lg border border-[#d1d5db] bg-white px-3.5 text-sm text-[#111827] placeholder:text-[#9ca3af] transition-colors focus:border-[#1e7e53] focus:outline-none focus:ring-1 focus:ring-[#1e7e53]"
                    />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                    <label
                        htmlFor="password"
                        className="block text-xs font-semibold tracking-wide text-[#1f2937]"
                    >
                        Password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="h-11 w-full rounded-lg border border-[#d1d5db] bg-white px-3.5 pr-10 text-sm text-[#111827] placeholder:text-[#9ca3af] transition-colors focus:border-[#1e7e53] focus:outline-none focus:ring-1 focus:ring-[#1e7e53]"
                        />
                        <button
                            type="button"
                            aria-label={
                                showPassword ? "Hide password" : "Show password"
                            }
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] transition-colors hover:text-[#4b5563]"
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Error alert */}
                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700">
                        {error}
                    </div>
                )}

                {/* Sign In Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 flex h-11 w-full items-center justify-center rounded-lg bg-[#1e7e53] text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#186443] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Signing in..." : "Sign in"}
                </button>
            </form>

            {/* Divider */}
            <div className="relative my-5 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#e5e7eb]" />
                </div>
                <div className="relative bg-white px-3 text-xs text-[#9ca3af]">
                    or
                </div>
            </div>

            {/* Demo credentials card */}
            <div
                onClick={fillDemoCredentials}
                title="Click to auto-fill demo credentials"
                className="cursor-pointer rounded-xl border border-[#d8ebe3] bg-[#f0f7f5] p-4 transition-colors hover:bg-[#e7f3ef]"
            >
                <h2 className="text-sm font-semibold text-[#111827]">
                    Use demo credentials from your email
                </h2>
                <p className="mt-1 text-xs text-[#6b7280]">
                    You’ll receive 3 demo accounts while registering.
                </p>
            </div>
        </div>
    );
}

export default LoginForm;
