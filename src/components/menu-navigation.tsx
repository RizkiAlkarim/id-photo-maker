import previousIcon from '@/public/previous.svg'
import nextIcon from '@/public/next.svg'

interface Props {
  currentMenu: string;
  theme: boolean;
  isLoading: boolean;
  handleLoading(isLoading: boolean): void;
  handleCurrentMenu(currentMenu: string): void;
  handleBackground(): void;
}

export default function MenuNavigation({currentMenu, isLoading, theme, handleLoading, handleCurrentMenu, handleBackground}: Props){
  async function previousMenu(currentMenu: string){
    handleLoading(true)
    if(currentMenu == "edit")handleCurrentMenu("upload");
    else if(currentMenu == "download") handleCurrentMenu("edit");
    handleLoading(false)
  }

  async function nextMenu(){
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
    <div className="grid grid-cols-2 gap-2">
      <button
        onClick={() => previousMenu(currentMenu)}
        disabled={isLoading}
        className={`flex items-center justify-center ${currentMenu == "download" && "col-span-2"} self-end gap-2 bg-red-500 text-white border-solid ${theme ? "border-white" : "border-black"} border-2 border-b-4 border-r-4 px-4 py-2 rounded font-semibold text-black cursor-pointer w-full`}
      >
        <img src={previousIcon}/>
        Previous
      </button>
      <button
        onClick={() => nextMenu()}
        disabled={isLoading}
        className={`flex items-center justify-center self-end gap-2 bg-green-500 text-white border-solid ${theme ? "border-white" : "border-black"} border-2 border-b-4 border-r-4 px-4 py-2 rounded font-semibold text-black cursor-pointer ${currentMenu == "download" && "hidden"}`}
      >
        Next
        <img src={nextIcon}/>
      </button>
    </div>
  )
}
