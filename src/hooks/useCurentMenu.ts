import { useState } from "react";

export default function useCurrentMenu(defaultCurrentMenu: string, isLoading: boolean){
  const [currentMenu, setCurrentMenu] = useState<string>(defaultCurrentMenu)

  function handleCurrentMenu(currentMenu: string){
    if(isLoading) return;
    setCurrentMenu(currentMenu)
  }

  return {
    currentMenu,
    handleCurrentMenu
  }
}