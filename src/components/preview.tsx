import { Ref } from "react";

interface Props {
  imageRef: Ref<HTMLImageElement>;
  canvasRef: Ref<HTMLCanvasElement>;
  image: string;
  currentMenu: string;
}

export default function Preview({imageRef, canvasRef, image, currentMenu}: Props){
  return(
    <div className="flex">
      <img className={`max-h-[50vh] h-full block inset-0 ${currentMenu == "edit" ? "block" : "hidden"}`} src={image} ref={imageRef}/>
      <canvas className={`min-h-[50vh] max-h-[50vh] h-full self-end ${currentMenu == "edit" ? "hidden" : "block"}`} width="300" height="400" ref={canvasRef}></canvas>
    </div>
  )
}
