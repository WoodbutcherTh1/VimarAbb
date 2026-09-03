"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Layers, FolderOpen, Box, LayoutGrid } from "lucide-react";
import { Category, countProductsInCategory } from "@/lib/data";
import { cn } from "@/lib/utils";

interface CategorySidebarProps {
  categories: Category[];
  activePath: string[];
  onNavigate: (path: string[]) => void;
  accentDark: string;
}

function CategoryNode({
  category,
  depth,
  activePath,
  onNavigate,
  accentDark,
}: {
  category: Category;
  depth: number;
  activePath: string[];
  onNavigate: (path: string[]) => void;
  accentDark: string;
}) {
  const [isOpen, setIsOpen] = useState(
    activePath.includes(category.id) || depth < 1
  );
  const isActive = activePath[activePath.length - 1] === category.id;
  const hasChildren = category.children.length > 0;
  const count = countProductsInCategory(category);

  const handleClick = () => {
    const newPath = activePath.slice(0, depth);
    newPath[depth] = category.id;
    onNavigate(newPath);
    if (hasChildren) setIsOpen((v) => !v);
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
          isActive
            ? "bg-navy-900/5 font-medium text-navy-900"
            : "text-muted hover:bg-slate-100 hover:text-navy-900"
        )}
        style={{ paddingLeft: `${12 + depth * 14}px` }}
      >
        {hasChildren ? (
          <motion.span
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.15 }}
            className="shrink-0 text-slate-400"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </motion.span>
        ) : (
          <Box className="h-3.5 w-3.5 shrink-0 text-slate-400" />
        )}

        {depth === 0 ? (
          <Layers
            className="h-4 w-4 shrink-0"
            style={{ color: isActive ? accentDark : undefined }}
          />
        ) : depth === 1 ? (
          <FolderOpen
            className="h-4 w-4 shrink-0"
            style={{ color: isActive ? accentDark : undefined }}
          />
        ) : null}

        <span className="flex-1 truncate">{category.name}</span>

        {count > 0 && (
          <span
            className={cn(
              "shrink-0 rounded-full px-1.5 py-0.5 text-[11px] tabular-nums",
              isActive ? "bg-navy-900/10 text-navy-900" : "bg-slate-100 text-muted"
            )}
          >
            {count}
          </span>
        )}
      </button>

      <AnimatePresence initial={false}>
        {hasChildren && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {category.children.map((child) => (
              <CategoryNode
                key={child.id}
                category={child}
                depth={depth + 1}
                activePath={activePath}
                onNavigate={onNavigate}
                accentDark={accentDark}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CategorySidebar({
  categories,
  activePath,
  onNavigate,
  accentDark,
}: CategorySidebarProps) {
  return (
    <div className="flex h-full flex-col">
      <h3 className="px-3 pb-3 text-xs font-bold uppercase tracking-widest text-muted">
        Categories
      </h3>
      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {/* All products — clears the category path */}
        <button
          onClick={() => onNavigate([])}
          className={cn(
            "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
            activePath.length === 0
              ? "bg-navy-900/5 font-medium text-navy-900"
              : "text-muted hover:bg-slate-100 hover:text-navy-900"
          )}
        >
          <LayoutGrid className="h-4 w-4 shrink-0 text-slate-400" />
          <span className="flex-1">All products</span>
        </button>

        <div className="my-2 border-t border-line" />

        {categories.map((cat) => (
          <CategoryNode
            key={cat.id}
            category={cat}
            depth={0}
            activePath={activePath}
            onNavigate={onNavigate}
            accentDark={accentDark}
          />
        ))}
      </div>
    </div>
  );
}