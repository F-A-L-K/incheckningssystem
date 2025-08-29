
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AutocompleteOption {
  value: string;
  label: string;
  visitCount?: number;
}

interface AutocompleteInputProps {
  className?: string;
  options: AutocompleteOption[];
  onOptionSelect: (value: string) => void;
  loading?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  placeholder?: string;
  id?: string;
  type?: string;
}

const AutocompleteInput = React.forwardRef<HTMLInputElement, AutocompleteInputProps>(
  ({ className, options, onOptionSelect, loading, ...props }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
      // Only show dropdown if there are actual options AND the input is focused
      setIsOpen(options.length > 0 && isFocused);
      setSelectedIndex(-1);
    }, [options, isFocused]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, options.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0) {
            onOptionSelect(options[selectedIndex].value);
            setIsOpen(false);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          break;
      }
    };

    const handleOptionClick = (value: string) => {
      onOptionSelect(value);
      setIsOpen(false);
    };

    return (
      <div ref={containerRef} className="relative">
        <Input
          {...props}
          ref={ref}
          className={cn(className)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            // Delay hiding to allow option selection
            setTimeout(() => setIsFocused(false), 200);
            if (props.onBlur) props.onBlur();
          }}
          autoComplete="off"
        />
        {isOpen && options.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
            {options.map((option, index) => (
              <div
                key={option.value}
                className={cn(
                  "px-3 py-2 cursor-pointer text-lg hover:bg-gray-100",
                  selectedIndex === index && "bg-gray-100"
                )}
                onClick={() => handleOptionClick(option.value)}
              >
                <div className="flex justify-between items-center">
                  <span>{option.label}</span>
                  {/* {option.visitCount && (
                    <span className="text-xs text-gray-500">
                      {option.visitCount} besök
                    </span>
                  )} */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

AutocompleteInput.displayName = "AutocompleteInput";

export { AutocompleteInput };
