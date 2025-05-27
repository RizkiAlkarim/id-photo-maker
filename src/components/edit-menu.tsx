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
  const [currentMenu, setCurrentMenu] = useState<string>("edit")
  const [ratio, setRatio] = useState<number>(34)
  const [bgColor, setBgColor] = useState<string>("red")
  const [session, setSession] = useState<sessionConfig | null>(null)
  const [modnetSession, setMODNetSession] = useState<MODNetSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [originalFile, setOriginalFile] = useState<File | null>(null)

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

const handleBackground = useCallback(async () => {
  if (!imageRef.current || !canvasRef.current || !modnetSession || !session || !originalFile) return;
  
  try {
    const image = await loadFullResImage(originalFile)
    const croppedImage = await inference(image, canvasRef.current, session);
    const resultCanvas = await runMODNet(croppedImage, modnetSession, bgColor, ratio);

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    canvasRef.current.width = resultCanvas.width;
    canvasRef.current.height = resultCanvas.height;
    ctx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);
    ctx.drawImage(resultCanvas, 0, 0);
    handleCurrentMenu("download")

  } catch (err) {
    console.error("Background removal processing failed", err);
  }
}, [session, modnetSession, bgColor, ratio, originalFile]);

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

  function handleOriginalFile(file: File){
    setOriginalFile(file)
  }
  
  function loadFullResImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        resolve(img);
      }
      img.src = URL.createObjectURL(file);
    })
  }

  return(
    <div className={`${theme ? "border-white bg-black" : "border-black bg-white"} flex justify-betwwen items-end gap-12 p-12 rounded-md border-solid border-2 border-b-8 border-r-8 border-black min-h-[50vh]`}>
    {
      !image || currentMenu == "upload" ?
        <FileUploader handleOriginalFile={handleOriginalFile} handleFileChange={handleFileChange} handleCurrentMenu={handleCurrentMenu} theme={theme} />
        :
        (
          <>
          <Preview image={image} canvasRef={canvasRef} imageRef={imageRef} currentMenu={currentMenu}/>
          <div className="flex flex-col gap-4 min-w-max">
            {
              currentMenu == "edit" ?
                <>
                  <CropTool handleRatio={handleRatio} ratio={ratio} theme={theme}/>
                  <BgSelector handleBgColor={handleBgColor} bgColor={bgColor} theme={theme}/>
                </>
                :
                <>
                  <FileDownloader canvasRef={canvasRef} theme={theme}/>
                </>
            }
            <MenuNavigation isLoading={isLoading} handleLoading={handleLoading} handleBackground={handleBackground} currentMenu={currentMenu} handleCurrentMenu={handleCurrentMenu} theme={theme}/>
          </div>
          </>
        )
    }
    </div>
  )
}