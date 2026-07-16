import React, { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  error?: string;
  helperText?: string;
  showPasswordStrength?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, icon: IconComponent, error, helperText, type = "text", showPasswordStrength, value, onChange, ...props },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const isPassword = type === "password";
    const currentType = isPassword ? (showPassword ? "text" : "password") : type;

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      if (onChange) {
        onChange(e);
      }
    };

    // Calculate password strength
    const getPasswordStrength = (pass: string) => {
      let score = 0;
      if (!pass) return { score, label: "Very Weak", color: "bg-gray-200" };
      if (pass.length >= 8) score++;
      if (/[A-Z]/.test(pass)) score++;
      if (/[a-z]/.test(pass)) score++;
      if (/\d/.test(pass)) score++;
      if (/[@$!%*?&#]/.test(pass)) score++;

      switch (score) {
        case 1:
        case 2:
          return { score, label: "Weak", color: "bg-red-500" };
        case 3:
          return { score, label: "Medium", color: "bg-amber-500" };
        case 4:
          return { score, label: "Strong", color: "bg-emerald-500" };
        case 5:
          return { score, label: "Very Strong", color: "bg-blue-600" };
        default:
          return { score, label: "Very Weak", color: "bg-red-500" };
      }
    };

    const strength = isPassword && showPasswordStrength ? getPasswordStrength(inputValue) : null;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        <label className="block text-sm font-medium text-slate-700 tracking-tight transition-colors">
          {label}
        </label>
        
        <div className="relative">
          {IconComponent && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <IconComponent className="h-5 w-5" />
            </div>
          )}
          
          <input
            ref={ref}
            type={currentType}
            onChange={handleTextChange}
            className={`w-full h-[52px] bg-white border text-slate-900 text-base rounded-xl pr-11 outline-none transition-all placeholder:text-slate-400 ${
              IconComponent ? "pl-11" : "pl-4"
            } ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            }`}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          )}
        </div>

        {error && (
          <p className="text-red-500 text-xs font-semibold m-0 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-red-500 inline-block"></span>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="text-slate-400 text-xs m-0">{helperText}</p>
        )}

        {/* Password Strength Indicator */}
        {strength && inputValue && (
          <div className="mt-2 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-500">Password Strength:</span>
              <span className={
                strength.score <= 2 ? "text-red-500" :
                strength.score === 3 ? "text-amber-500" :
                strength.score === 4 ? "text-emerald-500" : "text-blue-600"
              }>{strength.label}</span>
            </div>
            <div className="flex gap-1 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              {[1, 2, 3, 4, 5].map((idx) => (
                <div
                  key={idx}
                  className={`flex-grow rounded-full transition-all duration-300 ${
                    idx <= strength.score ? strength.color : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
