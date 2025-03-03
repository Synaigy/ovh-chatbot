
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  language: string;
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full my-2 font-mono text-sm">
      {language && (
        <div className="px-3 py-1 text-xs rounded-t-md bg-white/10 text-white/70">
          {language}
        </div>
      )}
      <div className={cn(
        "relative overflow-auto p-4 rounded-md bg-black/40",
        language && "rounded-t-none"
      )}>
        <pre className="overflow-x-auto whitespace-pre scrollbar-thin">
          <code>{code}</code>
        </pre>
        <button
          onClick={handleCopy}
          className={cn(
            "absolute top-2 right-2 p-1 rounded",
            "text-white/70 hover:text-white",
            "bg-white/5 hover:bg-white/10 transition-all duration-200"
          )}
          aria-label={copied ? "Copied" : "Copy code"}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  );
};

export default CodeBlock;
