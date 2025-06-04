import { RefObject, useCallback } from "react";
import { runObjectDetection, sessionConfig, } from "../utils/detectObject";
import { BgRemovalSession, runBackgroundRemoval } from "../utils/removeBackground";
import getFullResImage from "../utils/getFullResImage";
import drawImage from "../utils/drawImage";

export default function useBgReplacement(
  imageRef: RefObject<HTMLImageElement>,
  canvasRef: RefObject<HTMLCanvasElement>,
  bgColor: string,
  ratio: number,
  originalFile: File | null,
  objectDetectionSession: sessionConfig | null,
  bgRemovalSession: BgRemovalSession | null
){

  const handleBackground = useCallback(async () => {
    if (!imageRef || !canvasRef || !bgRemovalSession || !objectDetectionSession || !originalFile) return;
    
    try {
      const image = await getFullResImage(originalFile)
      const croppedImage = await runObjectDetection(image, canvasRef.current, objectDetectionSession);
      const resultCanvas = await runBackgroundRemoval(croppedImage, bgRemovalSession, bgColor, ratio);
      drawImage(canvasRef as RefObject<HTMLCanvasElement>, resultCanvas)
    } catch (err) {
      console.error("Background removal processing failed", err);
    }
  }, [objectDetectionSession, bgRemovalSession, bgColor, ratio, originalFile]);

  return {
    handleBackground
  }
}