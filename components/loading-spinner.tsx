import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  size?: number
  text?: string
  className?: string
}

export default function LoadingSpinner({ size = 24, text = "Loading...", className = "" }: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
      <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" width={size} height={size} />
      {text && <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{text}</p>}
    </div>
  )
}
