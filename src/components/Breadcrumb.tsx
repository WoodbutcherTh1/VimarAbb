"use client";

import { motion } from "framer-motion";
import { ChevronRight, Home } from "lucide-react";
import { Category, getCategoryByPath } from "@/lib/data";

interface BreadcrumbProps {
  brandName: string;
  path: string[];
  categories: Category[];
  onNavigate: (path: string[]) => void;
  onHome: () => void;
}

export default function Breadcrumb({ brandName, path, categories, onNavigate, onHome }: BreadcrumbProps) {
  const pathNames: { name: string; targetPath: string[] }[] = [];

  for (let i = 0; i <= path.length; i++) {
    const targetPath = path.slice(0, i);
    const cat = i === 0 ? null : getCategoryByPath(categories, targetPath);
    pathNames.push({
      name: i === 0 ? brandName : cat?.name || "",
      targetPath,
    });
  }

  return (
    <nav className="flex items-center gap-2 text-sm px-4 md:px-6 py-4 border-b border-white/5 overflow-x-auto">
      {/* Leftmost crumb leaves the brand entirely and returns to the landing;
          the brand crumb after it only resets the category path. */}
      <motion.button
        onClick={onHome}
        className="flex items-center gap-1.5 shrink-0 text-white/40 hover:text-white/70 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Home className="w-3.5 h-3.5" />
        Home
      </motion.button>
      {pathNames.map((item, index) => (
        <div key={index} className="flex items-center gap-2 shrink-0">
          <ChevronRight className="w-3.5 h-3.5 text-white/20" />
          <motion.button
            onClick={() => onNavigate(item.targetPath)}
            className={`flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              index === pathNames.length - 1
                ? "text-white font-medium"
                : "text-white/40 hover:text-white/70"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {item.name}
          </motion.button>
        </div>
      ))}
    </nav>
  );
}
