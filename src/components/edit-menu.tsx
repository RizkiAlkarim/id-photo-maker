import { RefObject, useEffect, useRef, useState } from "react"
import cv from "@techstark/opencv-js"
import {sessionConfig, config, loadObjectDetectionModel} from "../utils/detectObject.ts"
import { loadBgRemovalModel, BgRemovalSession } from "../utils/removeBackground.ts";
import useRatio from "../hooks/useRatio.ts"
import useBgColor from "../hooks/useBgColor.ts"
import useCurrentMenu from "../hooks/useCurentMenu.ts"
import useOriginalFile from "../hooks/useOriginalFile.ts"
import useLoading from "../hooks/useLoading.ts"
import useImage from "../hooks/useImage.ts"
import useBgReplacement from "../hooks/useBgReplacement.ts"
import Preview from "./preview.tsx"
import BgSelector from "./bg-selector.tsx"
import CropTool from "./crop-tool.tsx"
import FileUploader from "./file-uploader.tsx"
import FileDownloader from "./file-downloader.tsx"
import MenuNavigation from "./menu-navigation.tsx"

const objectDetectionConfig: config = {
  inputShape: [1, 3, 640, 640],
  topK: 100,
  iouThreshold: 0.45,
  scoreThreshold: 0.45,
}

export default function EditMenu({theme}: {theme: boolean}){
  const imageRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [objectDetectionSession, setObjectDetectionSession] = useState<sessionConfig | null>(null)
  const [backgroundRemovalSession, setBackgroundRemovalSession] = useState<BgRemovalSession | null>(null);

  const {image, handleImageChange} = useImage()
  const {originalFile, handleOriginalFile} = useOriginalFile()
  const {isLoading, handleLoading} = useLoading()
  const {currentMenu, handleCurrentMenu} = useCurrentMenu("edit", false)
  const {ratio, handleRatio} = useRatio(34)
  const {bgColor, handleBgColor} = useBgColor("red")

  useEffect(() => {
    async function initializeModel(){
      cv["onRuntimeInitialized"] = async () => {
        try {
          const {model, nms} = await loadObjectDetectionModel(objectDetectionConfig)
          setObjectDetectionSession({
            model,
            nms,
            inputShape: objectDetectionConfig.inputShape,
            topK: objectDetectionConfig.topK,
            iouThreshold: objectDetectionConfig.iouThreshold,
            scoreThreshold: objectDetectionConfig.scoreThreshold
          })
          const backgroundRemoval = await loadBgRemovalModel(512);
          setBackgroundRemovalSession(backgroundRemoval);
          } catch(error) {
            throw new Error("Error occured during initialize model")
        }
      }
    }
    initializeModel();
  }, [])

  const {handleBackground} = useBgReplacement(
    imageRef as RefObject<HTMLImageElement>,
    canvasRef as RefObject<HTMLCanvasElement>,
    bgColor,
    ratio,
    originalFile,
    objectDetectionSession,
    backgroundRemovalSession
  )

  return(
    <div className={`${theme ? "border-white bg-black" : "border-black bg-white"} flex justify-between items-center gap-12 p-12 rounded-md border-solid border-2 border-b-8 border-r-8 border-black max-w-[80vw] lg:max-w-screen lg:min-h-[50vh]`}>
    {
      !image || currentMenu == "upload" ?
        <FileUploader handleOriginalFile={handleOriginalFile} handleImageChange={handleImageChange} handleCurrentMenu={handleCurrentMenu} theme={theme} />
        :
        (
          <div className="flex flex-col lg:flex-row justify-between self-end gap-6 w-full">
            <Preview image={image} canvasRef={canvasRef} imageRef={imageRef} currentMenu={currentMenu}/>
            <div className="flex flex-col gap-2 min-w-full lg:min-w-max self-end">
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
          </div>
        )
    }
    </div>
  )
}