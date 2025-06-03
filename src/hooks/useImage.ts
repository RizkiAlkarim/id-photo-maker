import { useState } from "react"

export default function useImage(){
  const [image, setImage] = useState(null)

  function handleImageChange(imageData: any){
    setImage(imageData)
  }

  return{
    image,
    handleImageChange
  }
}