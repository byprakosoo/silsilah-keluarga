"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  showLabel?: boolean
  className?: string
}

export function ThemeToggle({ showLabel, className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const label = theme === "dark" ? "Mode Terang" : "Mode Gelap"

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size={showLabel ? "default" : "icon"}
        className={cn(showLabel ? "w-full justify-start gap-3" : "h-9 w-9", className)}
        disabled
      >
        <Sun className="h-4 w-4" />
        {showLabel && label}
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size={showLabel ? "default" : "icon"}
      className={cn(showLabel ? "w-full justify-start gap-3" : "h-9 w-9", className)}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      {showLabel && label}
    </Button>
  )
}
