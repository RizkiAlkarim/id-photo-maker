interface Props {
  currentMenu: string;
  theme: boolean;
  isLoading: boolean;
  handleLoading(isLoading: boolean): void;
  handleCurrentMenu(currentMenu: string): void;
  handleAutoCrop(): void;
  handleBackground(): void;
}

export default function MenuNavigation({currentMenu, isLoading, theme, handleLoading, handleCurrentMenu, handleAutoCrop, handleBackground}: Props){

  function previousMenu(currentMenu: string){
    handleLoading(true)
    if(currentMenu == "crop")handleCurrentMenu("upload");
    else if(currentMenu == "bg-selection") handleCurrentMenu("crop");
    else if(currentMenu == "download") handleCurrentMenu("bg-selection");
    handleLoading(false)
  }

  function nextMenu(currentMenu: string){
    handleLoading(true)
    if(currentMenu == "crop"){
      handleCurrentMenu("bg-selection")
      handleAutoCrop()
    }
    else if(currentMenu == "bg-selection"){
      handleCurrentMenu("download")
      handleBackground()
    }
    handleLoading(false)
  }

  return(
    <div className="flex gap-2">
      <button onClick={() => previousMenu(currentMenu)} disabled={isLoading} className={`flex items-center justify-center gap-2 bg-red-500 text-white border-solid ${theme ? "border-white" : "border-black"} border-2 border-b-4 border-r-4 px-4 py-2 rounded font-semibold text-black cursor-pointer w-full`}>
        <img src="../../public/previous.svg"/>
        Previous
      </button>
      <button onClick={() => nextMenu(currentMenu)} disabled={isLoading} className={`flex items-center justify-center gap-2 bg-green-500 text-white border-solid ${theme ? "border-white" : "border-black"} border-2 border-b-4 border-r-4 px-4 py-2 rounded font-semibold text-black cursor-pointer ${currentMenu == "download" && "hidden"}`}>
        Next
        <img src="../../public/next.svg"/>
      </button>
    </div>
  )
}
