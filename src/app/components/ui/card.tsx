// src/components/ui/card.tsx
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
}

export const Card = ({ children }: CardProps) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4">{children}</div>
  )
}

export const CardHeader = ({ children }: CardProps) => {
  return <div className="border-b border-gray-200 pb-4 mb-4">{children}</div>
}

export const CardTitle = ({ children }: CardProps) => {
  return <h2 className="text-xl font-semibold text-gray-800">{children}</h2>
}

export const CardContent = ({ children }: CardProps) => {
  return <div>{children}</div>
}
