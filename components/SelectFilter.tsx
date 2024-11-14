"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectFilterProps<T> {
  items: T[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  itemValue: keyof T;
  itemLabel: keyof T;
  className?: string; // Optional className prop for custom styling
}

function SelectFilter<T>({
  items,
  value,
  onChange,
  placeholder = "Select...",
  itemValue,
  itemLabel,
  className = "", // Default to an empty string if no className is provided
}: SelectFilterProps<T>) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`border-zinc-800 ${className}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="border-zinc-800">
        <SelectItem value="all">All</SelectItem>
        {items.map((item) => (
          <SelectItem
            key={String(item[itemValue])}
            value={String(item[itemValue])}
          >
            {String(item[itemLabel])}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default SelectFilter;
