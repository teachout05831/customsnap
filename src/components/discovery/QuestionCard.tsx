"use client";

import { cn } from "@/lib/utils";

interface QuestionCardProps {
  title: string;
  description?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function QuestionCard({
  title,
  description,
  required = false,
  children,
  className,
}: QuestionCardProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          {title}
          {required && (
            <span className="text-red-500 text-sm font-normal">*</span>
          )}
        </h3>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
