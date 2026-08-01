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
  activePath,
  onNavigate,
  accentColor,
}: {
  category: Category;
  depth: number;
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
    <div className="select-none">
      <motion.button
        onClick={handleClick}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left text-sm transition-all group",
          isActive
            ? "bg-white/10 text-white font-medium"
            : "text-white/50 hover:text-white/80 hover:bg-white/5"
        )}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
        whileHover={{ x: 2 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {hasChildren ? (
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          </motion.div>
        ) : (
          <Box className="w-3.5 h-3.5 opacity-30" />
        )}

        {depth === 0 ? (
          <Layers className="w-4 h-4" style={{ color: isActive ? accentColor : undefined }} />
        ) : depth === 1 ? (
          <FolderOpen className="w-4 h-4" style={{ color: isActive ? accentColor : undefined }} />
        ) : null}

        <span className="flex-1 truncate">{category.name}</span>

        {hasProducts && (
          <span className="text-xs opacity-30 px-1.5 py-0.5 rounded-full bg-white/5">
            {category.products.length}
          </span>
        )}
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
            {category.children.map((child) => (
              <CategoryNode
                key={child.id}
                category={child}
                depth={depth + 1}
                activePath={activePath}
                onNavigate={onNavigate}
                accentColor={accentColor}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Sidebar({ categories, activePath, onNavigate, accentColor }: SidebarProps) {
  return (
    <div className="w-72 h-full overflow-y-auto border-r border-white/5 bg-black/20 backdrop-blur-sm p-4">
      <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4 px-3">
        Categories
      </h3>
      <div className="space-y-0.5">
        {categories.map((cat) => (
          <CategoryNode
            key={cat.id}
            category={cat}
            depth={0}
            activePath={activePath}
            onNavigate={onNavigate}
            accentColor={accentColor}
          />
        ))}
      </div>
    </div>
  );
}
