import { useEffect, useRef, useState } from "react"

const GLYPHS = "!<>-_\\/[]{}—=+*^?#_01"

interface ScrambleTextProps {
  text: string
  className?: string
  /** Total resolve duration in ms. */
  duration?: number
}

/**
 * Renders `text`, but on mount it "decodes" into place from random glyphs,
 * left to right — a nod to what this tool actually does to Luau source.
 * Respects prefers-reduced-motion by skipping straight to the final text.
 */
export function ScrambleText({ text, className, duration = 650 }: ScrambleTextProps) {
  const [display, setDisplay] = useState(text)
  const frame = useRef(0)

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduceMotion) {
      setDisplay(text)
      return
    }

    const totalFrames = Math.round(duration / 40)
    let cancelled = false

    function tick() {
      if (cancelled) return
      frame.current += 1
      const progress = frame.current / totalFrames
      const revealCount = Math.floor(progress * text.length)

      const next = text
        .split("")
        .map((char, i) => {
          if (char === " ") return " "
          if (i < revealCount) return char
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        })
        .join("")

      setDisplay(next)

      if (revealCount < text.length) {
        setTimeout(tick, 40)
      } else {
        setDisplay(text)
      }
    }

    tick()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  return (
    <span className={className} aria-label={text}>
      {display}
    </span>
  )
}
