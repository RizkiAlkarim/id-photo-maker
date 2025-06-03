import { RefObject, useCallback } from "react";
import { inference, sessionConfig, } from "../utils/inference";
import { MODNetSession, runMODNet } from "../utils/modnet";
import getFullResImage from "../utils/getFullResImage";
import drawImage from "../utils/drawImage";

export default function useBgReplacement(
  imageRef: RefObject<HTMLImageElement>,
  canvasRef: RefObject<HTMLCanvasElement>,
  bgColor: string,
  ratio: number,
  originalFile: File | null,
  modnetSession: MODNetSession | null,
  session: sessionConfig | null
){

  const handleBackground = useCallback(async (
  ) => {
    if (!imageRef || !canvasRef || !modnetSession || !session || !originalFile) return;
    
    try {
      const image = await getFullResImage(originalFile)
      const croppedImage = await inference(image, canvasRef.current, session);
      const resultCanvas = await runMODNet(croppedImage, modnetSession, bgColor, ratio);
      drawImage(canvasRef as RefObject<HTMLCanvasElement>, resultCanvas)
      
    } catch (err) {
      console.error("Background removal processing failed", err);
    }
  }, [session, modnetSession, bgColor, ratio, originalFile]);

  return {
    handleBackground
  }
}