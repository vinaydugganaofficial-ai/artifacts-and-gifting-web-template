"use client";

import React, {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export type CustomSelectOption = {
  value: string;
  label: ReactNode;
  count?: number;
  secondary?: string;
  disabled?: boolean;
};

export type CustomSelectProps = {
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  options: readonly CustomSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  menuClassName?: string;
  variant?: "underline" | "compact";
  onChange?: (value: string) => void;
  onValueChange?: (value: string) => void;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
};

/**
 * Accessible Custom Dropdown Component
 *
 * Implements WAI-ARIA combobox/listbox pattern with complete keyboard navigation,
 * click-outside dismiss, and seamless native form / FormData integration.
 * Styled in the Viraasat theme: cream ground (#FAF6F0), dark green text (#243A2D),
 * terracotta accents (#A94F35), and refined borders.
 */
export function CustomSelect({
  id: explicitId,
  name,
  value: controlledValue,
  defaultValue,
  options,
  placeholder = "Select an option",
  disabled = false,
  invalid = false,
  className,
  menuClassName,
  variant = "underline",
  onChange,
  onValueChange,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
}: CustomSelectProps) {
  const generatedId = useId();
  const id = explicitId || generatedId;
  const listboxId = `${id}-listbox`;

  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<string>(() => {
    if (controlledValue !== undefined) return controlledValue;
    if (defaultValue !== undefined) return defaultValue;
    return options[0]?.value ?? "";
  });

  const selectedValue = isControlled ? controlledValue : internalValue;

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  // Find currently selected option object
  const selectedOption = options.find((opt) => opt.value === selectedValue);

  // Select an option, close dropdown, and dispatch changes
  const selectOption = useCallback(
    (option: CustomSelectOption) => {
      if (option.disabled || disabled) return;

      if (!isControlled) {
        setInternalValue(option.value);
      }

      onChange?.(option.value);
      onValueChange?.(option.value);

      // Dispatch native change event on hidden input so parent forms (and onChange listeners) fire
      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = option.value;
        const event = new Event("change", { bubbles: true });
        hiddenInputRef.current.dispatchEvent(event);
      }

      setIsOpen(false);
      setHighlightedIndex(-1);
      triggerRef.current?.focus();
    },
    [disabled, isControlled, onChange, onValueChange],
  );

  // Click outside listener
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listboxRef.current) {
      const activeItem = listboxRef.current.children[highlightedIndex] as HTMLElement;
      if (activeItem) {
        activeItem.scrollIntoView({ block: "nearest" });
      }
    }
  }, [isOpen, highlightedIndex]);

  // Handle keyboard events on trigger
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    switch (e.key) {
      case "ArrowDown":
      case "Down": {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          const currentIndex = options.findIndex((opt) => opt.value === selectedValue);
          setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
        } else {
          setHighlightedIndex((prev) => {
            const next = prev + 1;
            return next >= options.length ? 0 : next;
          });
        }
        break;
      }
      case "ArrowUp":
      case "Up": {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          const currentIndex = options.findIndex((opt) => opt.value === selectedValue);
          setHighlightedIndex(
            currentIndex >= 0 ? currentIndex : options.length - 1,
          );
        } else {
          setHighlightedIndex((prev) => {
            const next = prev - 1;
            return next < 0 ? options.length - 1 : next;
          });
        }
        break;
      }
      case "Enter":
      case " ": {
        e.preventDefault();
        if (isOpen) {
          if (highlightedIndex >= 0 && highlightedIndex < options.length) {
            const opt = options[highlightedIndex];
            if (opt) selectOption(opt);
          } else {
            setIsOpen(false);
          }
        } else {
          setIsOpen(true);
          const currentIndex = options.findIndex((opt) => opt.value === selectedValue);
          setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
        }
        break;
      }
      case "Escape": {
        if (isOpen) {
          e.preventDefault();
          setIsOpen(false);
          setHighlightedIndex(-1);
          triggerRef.current?.focus();
        }
        break;
      }
      case "Tab": {
        if (isOpen) {
          setIsOpen(false);
          setHighlightedIndex(-1);
        }
        break;
      }
      case "Home": {
        if (isOpen) {
          e.preventDefault();
          setHighlightedIndex(0);
        }
        break;
      }
      case "End": {
        if (isOpen) {
          e.preventDefault();
          setHighlightedIndex(options.length - 1);
        }
        break;
      }
      default:
        break;
    }
  };

  const triggerBase =
    variant === "compact"
      ? "h-12 shrink-0 cursor-pointer border-0 bg-transparent pr-2.5 text-sm tabular-nums text-deep-brown focus:outline-none flex items-center justify-between gap-1.5"
      : "w-full border-0 border-b bg-transparent px-0 text-sm tracking-wide text-deep-brown focus:outline-none transition-colors h-12 flex items-center justify-between gap-2 text-left cursor-pointer";

  const triggerTone =
    variant === "compact"
      ? ""
      : invalid
        ? "border-b-danger focus:border-b-danger"
        : isOpen
          ? "border-b-terracotta"
          : "border-b-deep-brown/25 hover:border-b-deep-brown/60 focus:border-b-terracotta";

  return (
    <div ref={containerRef} className="relative inline-block w-full">
      {/* Hidden input for standard form submission / FormData */}
      {name && (
        <input
          ref={hiddenInputRef}
          type="hidden"
          name={name}
          value={selectedValue}
        />
      )}

      {/* Accessible trigger button */}
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        aria-invalid={invalid || undefined}
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          setIsOpen((prev) => {
            const next = !prev;
            if (next) {
              const currentIndex = options.findIndex(
                (opt) => opt.value === selectedValue,
              );
              setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
            }
            return next;
          });
        }}
        onKeyDown={handleKeyDown}
        className={cn(triggerBase, triggerTone, className)}
      >
        <span className="truncate">
          {selectedOption ? (
            <span className="flex items-center gap-1.5">
              <span>{selectedOption.label}</span>
              {typeof selectedOption.count === "number" && (
                <span className="text-xs text-deep-brown/50">
                  ({selectedOption.count})
                </span>
              )}
            </span>
          ) : (
            <span className="text-deep-brown/40">{placeholder}</span>
          )}
        </span>

        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 text-deep-brown/50 transition-transform duration-200",
            isOpen && "rotate-180 text-terracotta",
          )}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <ul
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby || id}
          className={cn(
            "absolute left-0 top-full z-50 mt-1.5 max-h-64 min-w-full w-max max-w-sm overflow-y-auto",
            "border border-deep-brown/15 bg-[#FAF6F0] p-1.5 shadow-2xl rounded-none",
            "backdrop-blur-sm transition-all duration-150 animate-in fade-in-0 zoom-in-95",
            menuClassName,
          )}
        >
          {options.map((option, index) => {
            const isSelected = option.value === selectedValue;
            const isHighlighted = index === highlightedIndex;

            return (
              <li
                key={option.value}
                id={`${id}-option-${option.value}`}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled}
                onClick={() => selectOption(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={cn(
                  "relative flex cursor-pointer items-center justify-between gap-3 px-3.5 py-2.5 text-xs transition-colors",
                  option.disabled && "cursor-not-allowed opacity-40",
                  isSelected
                    ? "bg-[#EAE0CF] text-forest font-medium"
                    : isHighlighted
                      ? "bg-[#EAE0CF]/70 text-forest"
                      : "text-deep-brown/90 hover:bg-[#EAE0CF]/50 hover:text-forest",
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="tracking-[0.04em]">{option.label}</span>
                  {typeof option.count === "number" && (
                    <span className="text-[10px] tabular-nums text-deep-brown/50">
                      ({option.count})
                    </span>
                  )}
                  {option.secondary && (
                    <span className="text-[10px] uppercase tracking-[0.14em] text-deep-brown/50">
                      {option.secondary}
                    </span>
                  )}
                </div>

                {isSelected && (
                  <Check
                    className="size-3.5 shrink-0 text-terracotta"
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
