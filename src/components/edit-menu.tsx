import Preview from "./preview.tsx"
import BgSelector from "./bg-selector.tsx"
import CropTool from "./crop-tool.tsx"
import FileUploader from "./file-uploader.tsx"
import FileDownloader from "./file-downloader.tsx"
import MenuNavigation from "./menu-navigation.tsx"
import { useState } from "react"

export default function EditMenu({theme}){
  
  const [file, setFile] = useState(null)
  const [currentMenu, setCurrentMenu] = useState("crop")
  const [ratio, setRatio] = useState(null)
  const [bgColor, setBgColor] = useState("")

  function handleFileChange(imageData){
    setFile(imageData)
  }

  function handleCurrentMenu(currentMenu){
    setCurrentMenu(currentMenu)
  }

  function handleRatio(selectedRatio){
    setRatio(selectedRatio)
  }

  function handleBgColor(selectedBgColor){
    setBgColor(selectedBgColor)
  }
 
  return(
    <div className={`${theme ? "border-white bg-black" : "border-black bg-white"} flex justify-betwwen items-end gap-12 p-12 rounded-md border-solid border-2 border-b-8 border-r-8 border-black min-w-[40vw]`}>
    {
      !file || currentMenu == "upload" ? <FileUploader handleFileChange={handleFileChange} handleCurrentMenu={handleCurrentMenu} theme={theme} /> :
        (
          <>
          <Preview image={file} theme={theme}/>
          <div className="flex flex-col gap-4 min-w-max">
            {
              currentMenu == "crop" ? <CropTool handleRatio={handleRatio} ratio={ratio} theme={theme}/> :
              currentMenu == "bg-selection" ? <BgSelector handleBgColor={handleBgColor} bgColor={bgColor} theme={theme}/> :
              <FileDownloader theme={theme}/>
            }
            <MenuNavigation currentMenu={currentMenu} handleCurrentMenu={handleCurrentMenu} theme={theme}/>
          </div>
          </>
        )
    }
    </div>
  )
}
