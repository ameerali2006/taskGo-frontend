import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { User, Mail, Phone, Lock, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const signupSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .length(10, "Phone number must be exactly 10 digits")
    .regex(/^\d+$/, "Phone number must contain only numbers"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[@$!%*?&#]/, "Password must contain at least one special character"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export const Signup: React.FC = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    try {
      const { confirmPassword, ...signupData } = data;
      await signUp(signupData);
      toast.success("Account created successfully!");
      navigate("/tasks");
    } catch (error: any) {
      toast.error(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 text-left">
      {/* Left side: SaaS Illustration (45% Width, Desktop Only) */}
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
              Start managing tasks like a pro.
            </h2>
            <p className="text-blue-100/90 text-sm leading-relaxed m-0">
              Create your account in seconds and unlock features optimized for productivity and speed.
            </p>
          </motion.div>

          {/* Abstract Graphic Box */}
          <div className="relative h-24 w-full bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden">
            <div className="absolute -left-10 w-24 h-24 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute -right-10 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/30 flex items-center justify-center text-xs font-bold">1</div>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/30 flex items-center justify-center text-xs font-bold">2</div>
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold">3</div>
            </div>
          </div>

          {/* Key bullets */}
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
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[450px] bg-white border border-slate-200 rounded-2xl shadow-xl p-10 flex flex-col gap-6 text-center my-auto"
        >
          {/* Mobile logo indicator */}
          <div className="flex items-center gap-2.5 lg:hidden self-center mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-extrabold text-white">
              T
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">TaskGo</span>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 m-0">
              Create Account
            </h1>
            <p className="text-slate-500 text-sm m-0">
              Get started with your free 14-day trial workspace today
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              id="name"
              label="Full Name"
              type="text"
              icon={User}
              placeholder="John Doe"
              error={errors.name?.message}
              {...register("name")}
            />

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
              id="phone"
              label="Phone Number"
              type="tel"
              icon={Phone}
              placeholder="10 digit number"
              error={errors.phone?.message}
              {...register("phone")}
            />

            <Input
              id="password"
              label="Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              showPasswordStrength={true}
              error={errors.password?.message}
              {...register("password")}
            />

            <Input
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            <Button type="submit" isLoading={isSubmitting} className="mt-2">
              Create Account
            </Button>
          </form>

        

          {/* Footer Link */}
          <p className="text-sm font-medium text-slate-500 text-center m-0">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-bold transition-colors"
            >
              Log In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};
