import Preview from "./preview.tsx"
import BgSelector from "./bg-selector.tsx"
import CropTool from "./crop-tool.tsx"
import FileUploader from "./file-uploader.tsx"
import FileDownloader from "./file-downloader.tsx"
import MenuNavigation from "./menu-navigation.tsx"
import { useCallback, useEffect, useRef, useState } from "react"
import {sessionConfig, config, loadModel, inference} from "../utils/inference.ts"
import cv from "@techstark/opencv-js"

export default function EditMenu({theme}: {theme: boolean}){
  const imageRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [image, setImage] = useState(null)
  const [croppedImage, setCroppedImage] = useState<string | null>(null)
  const [currentMenu, setCurrentMenu] = useState<string>("crop")
  const [ratio, setRatio] = useState<number>(34)
  const [bgColor, setBgColor] = useState<string>("white")
  const [session, setSession] = useState<sessionConfig | null>(null)

  // const path: modelPath = {
  //   mainModelPath: "/public/model/yolo11n-simplify-dynamic.onnx",
  //   nmsPath: `${window.location.href}public/model/yolo-decoder.onnx`,
  // }
  
  const config: config = {
    inputShape: [1, 3, 640, 640],
    topK: 100,
    iouThreshold: 0.45,
    scoreThreshold: 0.45,
  }

  useEffect(() => {
    async function initializeModel(){
      cv["onRuntimeInitialized"] = async () => {
        try {
          const {model, nms} = await loadModel(/*path,*/ config)
          setSession({
            model,
            nms,
            inputShape: config.inputShape,
            topK: config.topK,
            iouThreshold: config.iouThreshold,
            scoreThreshold: config.scoreThreshold
          })
          } catch(error) {
            throw new Error("Error occured during initialize model")
        }
      }
    }
    initializeModel();
  }, [])

  const handleAutoCrop = useCallback(async () => {
    if(imageRef.current == null){
      throw new Error("ref null")
    }
    if(session == null){
      throw new Error("session null")
    }

    try {
      const output = await inference(imageRef.current, session);
      if (output && output.length > 0) {
        const [x, y, width, height] = output[0].bbox.map((b: any) => Number(Math.round(b)));
        
        const canvas = canvasRef.current;
        if (!canvas) return;
        const canvasCtx = canvas.getContext('2d');
        if (!canvasCtx) return;
        canvas.width = width;
        canvas.height = height;
        
        canvasCtx.drawImage(
          imageRef.current, 
          x, y, width, height, 
          0, 0, width, height
        );
        const cropped = canvas.toDataURL("image/jpeg")
        setCroppedImage(cropped)
      }
    } catch (error) {
      throw new Error("Error occured during autocropping");
    }}, [session]
  )

  // TODO
  function handleBackground(){
    console.log("handle background")
  }

  function handleFileChange(imageData: any){
    setImage(imageData)
  }

  function handleCurrentMenu(currentMenu: string){
    setCurrentMenu(currentMenu)
  }

  function handleRatio(selectedRatio: number){
    setRatio(selectedRatio)
  }

  function handleBgColor(selectedBgColor: string){
    setBgColor(selectedBgColor)
  }
 
  return(
    <div className={`${theme ? "border-white bg-black" : "border-black bg-white"} flex justify-betwwen items-end gap-12 p-12 rounded-md border-solid border-2 border-b-8 border-r-8 border-black min-w-[40vw]`}>
    {
      !image || currentMenu == "upload" ? <FileUploader handleFileChange={handleFileChange} handleCurrentMenu={handleCurrentMenu} theme={theme} /> :
        (
          <>
          <Preview image={image} canvasRef={canvasRef} imageRef={imageRef} currentMenu={currentMenu} theme={theme}/>
          <div className="flex flex-col gap-4 min-w-max">
            {
              currentMenu == "crop" ? <CropTool handleRatio={handleRatio} ratio={ratio} theme={theme}/> :
              currentMenu == "bg-selection" ? <BgSelector handleBgColor={handleBgColor} bgColor={bgColor} theme={theme}/> :
              <FileDownloader theme={theme}/>
            }
            <MenuNavigation handleAutoCrop={handleAutoCrop} handleBackground={handleBackground} currentMenu={currentMenu} handleCurrentMenu={handleCurrentMenu} theme={theme}/>
          </div>
          </>
        )
    }
    </div>
  )
}
