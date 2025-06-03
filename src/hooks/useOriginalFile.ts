import { useState } from "react"

export default function useOriginalFile(){
  const [originalFile, setOriginalFile] = useState<File | null>(null)

  function handleOriginalFile(file: File){
    setOriginalFile(file)
  }

  return {
    originalFile,
    handleOriginalFile
  }
}