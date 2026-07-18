import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Mail, Lock, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z
    .string()
    .min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const res=await login(data);
      console.log(res)
      toast.success("Welcome back!");
      navigate("/tasks");
    } catch (error: any) {
      console.log(error)
      toast.error(error.message || "Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 text-left">
      {/* Left side: Premium SaaS Illustration (45% Width, Desktop Only) */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 text-white p-12 flex-col justify-between relative overflow-hidden shrink-0">
        {/* Decorative Grid Patterns */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        {/* Decorative Glowing Orbs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

        {/* Header / Logo */}
        <div className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-extrabold text-white text-base">
            T
          </div>
          <span className="text-xl font-bold tracking-tight">TaskGo</span>
        </div>

        {/* Hero Copy & Abstract Graphic */}
        <div className="max-w-md my-auto relative z-10 flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-bold text-blue-200 self-start">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Enterprise Task Manager</span>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight leading-tight m-0">
              Simplify your workflow. Empower your team.
            </h2>
            <p className="text-blue-100/90 text-sm leading-relaxed m-0">
              TaskGo brings all your tasks, team members, and milestones into a clean, modern workspace.
            </p>
          </motion.div>

          {/* Abstract Graphical Elements */}
          <div className="relative h-24 w-full bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden">
            <div className="absolute -left-10 w-24 h-24 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute -right-10 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/30 flex items-center justify-center text-xs font-bold">1</div>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/30 flex items-center justify-center text-xs font-bold">2</div>
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold">3</div>
            </div>
          </div>

          {/* Feature bullets */}
          <div className="flex flex-col gap-3">
            {[
              "Highly customizable dashboard views",
              "Tokens saved under secure HTTP cookies",
              "Real-time notifications and statistics"
            ].map((text, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm text-blue-100 font-medium">
                <CheckCircle2 className="w-5 h-5 text-blue-300 shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="text-xs text-blue-200/60 relative z-10 font-medium">
          © {new Date().getFullYear()} TaskGo Inc. All rights reserved.
        </div>
      </div>

      {/* Right side: Center Auth Card (55% Width) */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[450px] bg-white border border-slate-200 rounded-2xl shadow-xl p-10 flex flex-col gap-6 text-center"
        >
          {/* Mobile logo indicator */}
          <div className="flex items-center gap-2.5 lg:hidden self-center">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-extrabold text-white">
              T
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">TaskGo</span>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 m-0">
              Sign In
            </h1>
            <p className="text-slate-500 text-sm m-0">
              Enter your details below to log in to your workspace
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Input
              id="email"
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="name@company.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              id="password"
              label="Password"
              type="password"
              icon={Lock}
              placeholder="Enter your password"
              error={errors.password?.message}
              {...register("password")}
            />

            {/* Remember & Forgot controls */}
            <div className="flex items-center justify-between text-sm font-semibold">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4.5 h-4.5 rounded border-slate-200 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span>Remember me</span>
              </label>
              <Link
                to="/login"
                onClick={() => toast.success("Password reset demo link sent!")}
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" isLoading={isSubmitting}>
              Log In
            </Button>
          </form>

         

          {/* Footer Link */}
          <p className="text-sm font-medium text-slate-500 text-center m-0">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:text-blue-700 font-bold transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

