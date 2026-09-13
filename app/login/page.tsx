import { Leaf } from "lucide-react";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[#eef2f6] p-4 sm:p-6 lg:p-8">
            {/* Main Login Card */}
            <div className="flex w-full max-w-[1060px] overflow-hidden rounded-2xl bg-white shadow-xl lg:min-h-[580px]">
                {/* Left section: Living Room Hero Image with crisp typography */}
                <section className="relative hidden w-1/2 self-stretch overflow-hidden lg:flex lg:flex-col lg:justify-between p-8 xl:p-10 text-white">
                    <img
                        src="/living-room-hero.jpg"
                        alt="Ivy Homes Living Room"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/60" />

                    {/* Brand header */}
                    <div className="relative z-10 flex items-center gap-2.5">
                        <Leaf className="h-6 w-6 text-white" />
                        <span className="text-xl font-bold tracking-tight text-white">
                            Ivy Homes
                        </span>
                    </div>

                    {/* Middle Hero Heading */}
                    <div className="relative z-10 my-auto py-10">
                        <h2 className="text-3xl font-bold leading-[1.2] tracking-tight text-white xl:text-[34px]">
                            Find a place
                            <br />
                            that feels like home
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-white/90">
                            Rent. Explore. Invest.
                            <br />
                            All in one place.
                        </p>
                    </div>

                    {/* Bottom Tagline */}
                    <div className="relative z-10 text-xs font-medium leading-relaxed text-white/80">
                        Better homes.
                        <br />
                        Brighter tomorrows.
                    </div>
                </section>

                {/* Right section: Modular Login Form */}
                <section className="flex w-full flex-1 flex-col justify-center px-6 py-8 sm:px-12 md:px-14 lg:w-1/2 lg:px-12 xl:px-14">
                    <LoginForm />
                </section>
            </div>
        </main>
    );
}