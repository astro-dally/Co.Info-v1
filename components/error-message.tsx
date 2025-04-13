"use client"

import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface ErrorMessageProps {
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export default function ErrorMessage({ title, description, action }: ErrorMessageProps) {
  return (
    <Alert
      variant="destructive"
      className="bg-white dark:bg-gray-800 border-red-200 dark:border-red-900 max-w-md mx-auto"
    >
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
      {action && (
        <Button
          variant="outline"
          size="sm"
          onClick={action.onClick}
          className="mt-2 border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          {action.label}
        </Button>
      )}
    </Alert>
  )
}
