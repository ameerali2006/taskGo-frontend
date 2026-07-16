import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { AlertCircle, WifiOff, FileSearch, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface ErrorPageProps {
  type?: "404" | "500" | "network";
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ type = "404" }) => {
  const config = {
    404: {
      icon: FileSearch,
      iconColor: "text-blue-600 bg-blue-50 border-blue-100",
      title: "Page Not Found",
      description: "Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.",
    },
    500: {
      icon: AlertCircle,
      iconColor: "text-red-600 bg-red-50 border-red-100",
      title: "Internal Server Error",
      description: "Something went wrong on our end. Our engineering team has been notified and is fixing it.",
    },
    network: {
      icon: WifiOff,
      iconColor: "text-amber-600 bg-amber-50 border-amber-100",
      title: "Network Connection Error",
      description: "Unable to connect to the server. Please check your internet connection and try again.",
    },
  };

  const current = config[type];
  const Icon = current.icon;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white border border-slate-200/80 rounded-[24px] p-8 shadow-xl shadow-slate-100/50 flex flex-col items-center gap-6"
      >
        <div className={`p-4 rounded-2xl border flex items-center justify-center ${current.iconColor}`}>
          <Icon className="w-10 h-10" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight m-0">{current.title}</h1>
          <p className="text-slate-500 text-sm leading-relaxed m-0">{current.description}</p>
        </div>

        <div className="w-full flex flex-col gap-2.5 mt-2">
          <Link to="/tasks" className="w-full">
            <Button>
              <ArrowLeft className="w-4.5 h-4.5" />
              <span>Back to Dashboard</span>
            </Button>
          </Link>
          
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-[16px] border border-slate-200 transition-all cursor-pointer shadow-sm bg-transparent border-slate-200"
          >
            Retry Connection
          </button>
        </div>
      </motion.div>
    </div>
  );
};
