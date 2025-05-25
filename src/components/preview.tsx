import { Ref } from "react";

interface Props {
  imageRef: Ref<HTMLImageElement>;
  canvasRef: Ref<HTMLCanvasElement>;
  image: string;
  currentMenu: string;
  theme: boolean;
}

export default function Preview({imageRef, canvasRef, image, theme}: Props){
  return(
    <div className={`${theme ? "border-white" : "border-black"} border-solid border-1`}>
      <img className="max-h-[640px] block inset-0 hidden" src={image} ref={imageRef} />
      <canvas className="border border-solid border-green-200 min-h-[50vh] max-h-[50vh]" width="300" height="400" ref={canvasRef}></canvas>
    </div>
  )
}
