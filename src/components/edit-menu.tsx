import Preview from "./preview.tsx"
import BgSelector from "./bg-selector.tsx"
import CropTool from "./crop-tool.tsx"
import FileUploader from "./file-uploader.tsx"
import FileDownloader from "./file-downloader.tsx"
import MenuNavigation from "./menu-navigation.tsx"
import { useCallback, useEffect, useRef, useState } from "react"
import {sessionConfig, config, loadModel, inference} from "../utils/inference.ts"
import cv from "@techstark/opencv-js"
import { loadMODNetModel, runMODNet, MODNetSession } from "../utils/modnet.ts";

export default function EditMenu({theme}: {theme: boolean}){
  const imageRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [image, setImage] = useState(null)
  const [croppedImage, setCroppedImage] = useState<string | null>(null)
  const [currentMenu, setCurrentMenu] = useState<string>("crop")
  const [ratio, setRatio] = useState<number>(34)
  const [bgColor, setBgColor] = useState<string>("")
  const [session, setSession] = useState<sessionConfig | null>(null)
  const [modnetSession, setMODNetSession] = useState<MODNetSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false)


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
          const modnet = await loadMODNetModel("/model/modnet.onnx", { refSize: 512 });
          setMODNetSession(modnet);
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
        let [x, y, width, height] = output[0].bbox.map((b: any) => Number(Math.round(b)));
        
        const canvas = canvasRef.current;
        if(!canvas) return;
        const canvasCtx = canvas.getContext('2d');
        if(!canvasCtx) return;

        const yCoordinateToleration = 10;
        if(y < yCoordinateToleration) y = 0;
        else y -= yCoordinateToleration;
        
        const scaledHeight = width
        let croppedHeight = height
        if(height >= scaledHeight) croppedHeight = scaledHeight

        canvas.width = width;
        canvas.height = croppedHeight;
        canvasCtx.drawImage(
          imageRef.current, 
          x, y, width, croppedHeight, 
          0, 0, width, croppedHeight
        );
        const cropped = canvas.toDataURL("image/jpeg")
        setCroppedImage(cropped)
      }
    } catch (error) {
      throw new Error("Error occured during autocropping");
    }}, [session]
  )

const handleBackground = useCallback(async () => {
  if (!imageRef.current || !canvasRef.current || !modnetSession) return;
  try {
    const resultCanvas = await runMODNet(imageRef.current, modnetSession, bgColor, ratio);
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    canvasRef.current.width = resultCanvas.width;
    canvasRef.current.height = resultCanvas.height;
    ctx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);
    ctx.drawImage(resultCanvas, 0, 0);
  } catch (err) {
    console.error("Background removal processing failed", err);
  }
}, [modnetSession, bgColor, ratio]);

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

  function handleLoading(status: boolean){
    setIsLoading(status)
  }

  return(
    <div className={`${theme ? "border-white bg-black" : "border-black bg-white"} flex justify-betwwen items-end gap-12 p-12 rounded-md border-solid border-2 border-b-8 border-r-8 border-black min-h-[50vh]`}>
    {
      !image || currentMenu == "upload" ?
        <FileUploader handleFileChange={handleFileChange} handleCurrentMenu={handleCurrentMenu} theme={theme} />
        :
        (
          <>
          <Preview image={croppedImage ?? image} canvasRef={canvasRef} imageRef={imageRef} currentMenu={currentMenu} theme={theme}/>
          <div className="flex flex-col gap-4 min-w-max">
            {
              currentMenu == "crop" ?
              <CropTool handleRatio={handleRatio} ratio={ratio} theme={theme}/>
              :
              currentMenu == "bg-selection" ?
                <BgSelector handleBgColor={handleBgColor} bgColor={bgColor} theme={theme}/>
                :
                <FileDownloader canvasRef={canvasRef} theme={theme}/>
            }
            <MenuNavigation isLoading={isLoading} handleLoading={handleLoading} handleAutoCrop={handleAutoCrop} handleBackground={handleBackground} currentMenu={currentMenu} handleCurrentMenu={handleCurrentMenu} theme={theme}/>
          </div>
          </>
        )
    }
    </div>
  )
}