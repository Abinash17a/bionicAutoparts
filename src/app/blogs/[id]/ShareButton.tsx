"use client";

import React from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  title: string;
}

export default function ShareButton({ title }: ShareButtonProps) {
  const handleShare = () => {
    if (typeof window !== "undefined") {
      if (navigator.share) {
        navigator.share({
          title,
          url: window.location.href,
        });
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleShare} title="Share this article">
      <Share2 className="w-5 h-5 text-blue-600" />
    </Button>
  );
}
