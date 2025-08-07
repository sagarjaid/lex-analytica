"use client";

import React from 'react';
import { Copy, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

interface ClickableEmailProps {
  email: string;
  className?: string;
  showIcon?: boolean;
}

const ClickableEmail: React.FC<ClickableEmailProps> = ({ 
  email, 
  className = "", 
  showIcon = true 
}) => {
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      toast.success('Email copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy email');
    }
  };

  return (
    <button
      onClick={handleCopyEmail}
      className={`flex items-center gap-2 hover:underline transition-colors ${className}`}
      title="Click to copy email"
    >
      {showIcon && <Mail className="w-4 h-4" />}
      <span>Support</span>
      <Copy className="w-3 h-3 opacity-40 hover:opacity-60 transition-opacity" />
    </button>
  );
};

export default ClickableEmail;
