import { Ref, RefObject} from "react"

interface Props {
  canvasRef: Ref<HTMLCanvasElement> | null;
  theme: boolean;
}

export default function FileDownloader({canvasRef, theme}: Props){

  const downloadImage = ()=>{
    const canvas = (canvasRef as RefObject<HTMLCanvasElement>)?.current
    if(!canvas) return

    const image = canvas.toDataURL("image/png")
    const link = document.createElement('a')
    link.href = image
    link.download = 'id-photo.png'
    link.click()
  }
  
  return(
    <div className="flex flex-col">
      <button onClick={downloadImage} className={`flex items-center justify-center gap-2 bg-green-500 text-white border-solid ${theme ? "border-white" : "border-black"} border-2 border-b-4 border-r-4 px-4 py-2 rounded font-semibold text-black cursor-pointer`}>
        <img src="../../public/download.svg"/>
        Download
      </button>
    </div>
  )
}
