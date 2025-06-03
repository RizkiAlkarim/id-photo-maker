import { useState } from "react"

export default function useLoading(){
  const [isLoading, setIsLoading] = useState<boolean>(false)
  
  function handleLoading(status: boolean){
    setIsLoading(status)
  }

  return {
    isLoading,
    handleLoading
  }
}