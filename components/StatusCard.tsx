import { cn } from "@/lib/utils"
import React from "react"

type Props = {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

function StatusCard({
  title,
  description,
  action,
  className = "",
  children,
}: Props) {
  return (
    <div
      className={cn(
        "flex items-center justify-center minh-[400px] w-full",
        className,
      )}
    >
      <div className="text-center space-y-4 max-w-md w-full mx-4">
        {children}
        <div className="text-xl font-semibold">{title}</div>
        {description && <div className="text-sm ">{description}</div>}
        {action && <div className="mt-4">{action}</div>}
      </div>
    </div>
  )
}

export default StatusCard
