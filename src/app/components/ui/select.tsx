// src/components/ui/select.tsx
import { ReactNode } from 'react'

interface SelectProps {
  onValueChange: (value: string) => void
  children: ReactNode
}

export const Select = ({ onValueChange, children }: SelectProps) => {
  return (
    <select
      onChange={(e) => onValueChange(e.target.value)}
      className="block w-full p-2 border border-gray-300 rounded-lg"
    >
      {children}
    </select>
  )
}

export const SelectTrigger = ({ children }: { children: ReactNode }) => {
  return <div className="mb-2">{children}</div>
}

export const SelectContent = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>
}

export const SelectItem = ({ value, children }: { value: string; children: ReactNode }) => {
  return <option value={value}>{children}</option>
}

export const SelectValue = ({ placeholder }: { placeholder: string }) => {
  return <span className="text-gray-500">{placeholder}</span>
}
