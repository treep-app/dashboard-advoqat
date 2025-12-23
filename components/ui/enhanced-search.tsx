"use client";

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface EnhancedSearchProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function EnhancedSearch({
  placeholder = "Search...",
  value,
  onChange,
  className,
}: EnhancedSearchProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={cn(
        "relative group transition-all duration-200",
        className
      )}
    >
      <div
        className={cn(
          "absolute left-0 top-0 h-full flex items-center pl-4 text-muted-foreground transition-colors duration-200",
          isFocused && "text-primary"
        )}
      >
        <Search className="h-4 w-4" />
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "pl-11 pr-10 h-11 border-2 transition-all duration-200",
          "focus:border-primary focus:ring-2 focus:ring-primary/20",
          "bg-background/50 backdrop-blur-sm",
          isFocused && "border-primary shadow-lg shadow-primary/10"
        )}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-0 top-0 h-full flex items-center pr-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

