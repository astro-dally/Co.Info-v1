"use client"

import { AlertCircle, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface ErrorMessageProps {
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  retry?: boolean
}

export default function ErrorMessage({ title, description, action, retry = false }: ErrorMessageProps) {
  const router = useRouter()

  const handleRetry = () => {
    router.refresh()
  }

  return (
    <Alert
      variant="destructive"
      className="bg-white dark:bg-gray-800 border-red-200 dark:border-red-900 max-w-md mx-auto"
    >
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-1">{description}</AlertDescription>
      <div className="flex gap-2 mt-3">
        {action && (
          <Button
            variant="outline"
            size="sm"
            onClick={action.onClick}
            className="border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            {action.label}
          </Button>
        )}
        {retry && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
            className="border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <RefreshCw className="h-3 w-3 mr-2" />
            Retry
          </Button>
        )}
      </div>
    </Alert>
  )
}
