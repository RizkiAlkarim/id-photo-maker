import { RefObject } from 'react';

export default async function drawImage(
  canvasRef: RefObject<HTMLCanvasElement>,
  resultCanvas: HTMLCanvasElement
) {
  if (!canvasRef) return;
  const ctx = canvasRef.current.getContext('2d');
  if (!ctx) return;

  canvasRef.current.width = resultCanvas.width;
  canvasRef.current.height = resultCanvas.height;
  ctx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);
  ctx.drawImage(resultCanvas, 0, 0);
}
