"use client";

import React from "react";
import { brand } from "@/config/brand";

interface LogoProps {
  variant?: "mark" | "wordmark" | "full";
  size?: number;
  className?: string;
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = "full",
  size = 36,
  className = "",
  showTagline = false,
}) => {
  const mark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block shrink-0"
      aria-label={`${brand.name} logo mark`}
    >
      {/* V path stroke */}
      <path
        d="M13 17 C19 36 25 51 32 51 C39 51 45 36 51 17"
        stroke="#1C2A39"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      {/* Starting hollow ring (your own language) */}
      <circle
        cx="12"
        cy="11.5"
        r="5"
        stroke="#14707A"
        strokeWidth="3.5"
        fill="none"
      />
      {/* Destination solid dot (the new language) in Voya Coral */}
      <circle
        cx="52"
        cy="11"
        r="6.5"
        fill="#C9472F"
      />
    </svg>
  );

  if (variant === "mark") {
    return <div className={`inline-flex items-center ${className}`}>{mark}</div>;
  }

  const wordmark = (
    <div className="flex flex-col justify-center leading-none">
      <span className="font-display text-2xl tracking-tight text-ink">
        <span className="font-medium">Langua</span>
        <span className="font-extrabold text-coral">Voya</span>
      </span>
      {showTagline && (
        <span className="text-xs text-muted tracking-normal mt-0.5 font-normal">
          {brand.tagline}
        </span>
      )}
    </div>
  );

  if (variant === "wordmark") {
    return <div className={`inline-flex items-center ${className}`}>{wordmark}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {mark}
      {wordmark}
    </div>
  );
};
