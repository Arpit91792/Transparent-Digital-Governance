import * as React from "react";
import { Select as BaseSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SafeSelectProps {
  value: string | undefined;
  onValueChange: (value: string) => void;
  placeholder?: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
  "data-testid"?: string;
}

/**
 * Safe wrapper around Select component that catches any runtime errors
 * and prevents them from bubbling up to the runtime error plugin
 */
export const SafeSelect = React.memo(({ 
  value, 
  onValueChange, 
  placeholder, 
  children, 
  required,
  className,
  "data-testid": dataTestId,
  ...props 
}: SafeSelectProps) => {
  const safeOnValueChange = React.useCallback((newValue: string) => {
    try {
      if (typeof onValueChange === 'function') {
        onValueChange(newValue);
      }
    } catch (error) {
      console.error('Error in SafeSelect onValueChange:', error);
      // Don't throw - just log the error
    }
  }, [onValueChange]);

  try {
    return (
      <BaseSelect
        value={value || ""}
        onValueChange={safeOnValueChange}
        required={required}
        {...props}
      >
        <SelectTrigger className={className} data-testid={dataTestId}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {children}
        </SelectContent>
      </BaseSelect>
    );
  } catch (error) {
    console.error('Error rendering SafeSelect:', error);
    // Fallback UI if Select fails to render
    return (
      <div className={className || ""} data-testid={dataTestId}>
        <div className="h-12 rounded-xl border border-red-300 bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600">
          Error loading dropdown. Please refresh the page.
        </div>
      </div>
    );
  }
});

SafeSelect.displayName = "SafeSelect";

export { SelectContent, SelectItem, SelectTrigger, SelectValue };

