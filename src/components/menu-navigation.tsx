import previousIcon from '@/public/previous.svg'

interface Props {
  currentMenu: string;
  theme: boolean;
  isLoading: boolean;
  handleLoading(isLoading: boolean): void;
  handleCurrentMenu(currentMenu: string): void;
  handleBackground(): void;
}

export default function MenuNavigation({currentMenu, isLoading, theme, handleLoading, handleCurrentMenu, handleBackground}: Props){
  async function backToPreviousMenu(currentMenu: string){
    handleLoading(true)
    if(currentMenu == "edit")handleCurrentMenu("upload");
    else if(currentMenu == "download") handleCurrentMenu("edit");
    handleLoading(false)
  }

  async function getResultPhoto(){
    handleLoading(true)
    try {
      await handleBackground()
      handleCurrentMenu("download")
    } catch(e){
      throw new Error("error")
    } finally {
      handleLoading(false)
    }
  }

  return(
    <div className="flex flex-col md:grid md:grid-cols-2 gap-2">
      <button
        onClick={() => backToPreviousMenu(currentMenu)}
        disabled={isLoading}
        className={`flex items-center justify-center w-full self-end gap-2 bg-red-500 text-white border-solid ${theme ? "border-white" : "border-black"} border-2 border-b-4 border-r-4 px-4 py-2 rounded font-semibold text-black cursor-pointer ${currentMenu == "download" && "col-span-2"}`}
      >
        <img src={previousIcon}/>
        Back
      </button>
      <button
        onClick={() => getResultPhoto()}
        disabled={isLoading}
        className={`flex items-center justify-center w-full self-end gap-2 ${isLoading ? "bg-yellow-500" : "bg-green-500"} text-white border-solid ${theme ? "border-white" : "border-black"} border-2 border-b-4 border-r-4 px-4 py-2 rounded font-semibold text-black cursor-pointer ${currentMenu == "download" ? "hidden" : "block"}`}
      >
        { isLoading ? "Processing" : "Get Result"}
      </button>
    </div>
  )
}
