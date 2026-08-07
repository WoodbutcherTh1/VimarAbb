"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, FolderOpen, Layers, Box } from "lucide-react";
import { Category } from "@/lib/data";
import { cn } from "@/lib/utils";

interface SidebarProps {
  categories: Category[];
  activePath: string[];
  onNavigate: (path: string[]) => void;
  accentColor: string;
}

function CategoryNode({
  category,
  depth,
  index,
  activePath,
  onNavigate,
  accentColor,
}: {
  category: Category;
  depth: number;
  index: number;
  activePath: string[];
  onNavigate: (path: string[]) => void;
  accentColor: string;
}) {
  const [isOpen, setIsOpen] = useState(
    activePath.includes(category.id) || depth < 1
  );
  const isActive = activePath[activePath.length - 1] === category.id;
  const hasChildren = category.children.length > 0;
  const hasProducts = category.products.length > 0;

  const handleClick = () => {
    if (hasChildren || hasProducts) {
      const newPath = activePath.slice(0, depth);
      newPath[depth] = category.id;
      onNavigate(newPath);
    }
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <motion.div
      className="select-none"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: depth === 0 ? index * 0.05 : 0, duration: 0.35, ease: "easeOut" }}
    >
      <motion.button
        onClick={handleClick}
        className={cn(
          "relative w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left text-sm transition-colors group overflow-hidden",
          isActive
            ? "text-white font-medium"
            : "text-white/50 hover:text-white/80 hover:bg-white/5"
        )}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
        whileHover={{ x: 2 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {isActive && (
          <motion.div
            layoutId="sidebar-active-pill"
            className="absolute inset-0 rounded-lg bg-white/10"
            style={{ boxShadow: `inset 2px 0 0 0 ${accentColor}` }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
          />
        )}

        <span className="relative z-10 flex items-center gap-2 flex-1 min-w-0">
          {hasChildren ? (
            <motion.div
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              className="shrink-0"
            >
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </motion.div>
          ) : (
            <Box className="w-3.5 h-3.5 opacity-30 shrink-0" />
          )}

          {depth === 0 ? (
            <Layers className="w-4 h-4 shrink-0 transition-colors" style={{ color: isActive ? accentColor : undefined }} />
          ) : depth === 1 ? (
            <FolderOpen className="w-4 h-4 shrink-0 transition-colors" style={{ color: isActive ? accentColor : undefined }} />
          ) : null}

          <span className="flex-1 truncate">{category.name}</span>

          {hasProducts && (
            <span className="text-xs opacity-30 px-1.5 py-0.5 rounded-full bg-white/5 shrink-0">
              {category.products.length}
            </span>
          )}
        </span>
      </motion.button>

      <AnimatePresence>
        {hasChildren && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {category.children.map((child, i) => (
              <CategoryNode
                key={child.id}
                category={child}
                depth={depth + 1}
                index={i}
                activePath={activePath}
                onNavigate={onNavigate}
                accentColor={accentColor}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Sidebar({ categories, activePath, onNavigate, accentColor }: SidebarProps) {
  return (
    <div className="w-72 h-full overflow-y-auto border-r border-white/5 bg-black/20 backdrop-blur-sm p-4">
      <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4 px-3">
        Categories
      </h3>
      <div className="space-y-0.5">
        {categories.map((cat, i) => (
          <CategoryNode
            key={cat.id}
            category={cat}
            depth={0}
            index={i}
            activePath={activePath}
            onNavigate={onNavigate}
            accentColor={accentColor}
          />
        ))}
      </div>
    </div>
  );
}
