import useCurrentMenu from "../hooks/useCurentMenu";
import useLoading from "../hooks/useLoading";

interface Params {
  handleBackground(): void;
}

export default function handleMenu({handleBackground}: Params){
  const {handleCurrentMenu} = useCurrentMenu("edit", false)
  const {handleLoading} = useLoading()

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

  return {
    previousMenu,
    nextMenu
  }
}