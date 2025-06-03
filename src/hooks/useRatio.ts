import { useState } from "react"

export default function useRatio(defaultRatio: number){
  const [ratio, setRatio] = useState<number>(defaultRatio)

  function handleRatio(selectedRatio: number){
    setRatio(selectedRatio)
  }

  return {
    ratio,
    handleRatio
  }
}