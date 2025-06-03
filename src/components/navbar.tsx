import Logo from "@/public/logo.png"
import lightIcon from "@/public/light.png"
import darkIcon from "@/public/dark.png"

interface Props {
  theme: boolean;
  handleTheme: (theme: boolean) => void;
}

export default function Navbar({theme, handleTheme}: Props){
  return (
    <div className="min-h-[10%] px-12 py-5 border-solid border-b-2">
      <div className="flex justify-between items-center">
        <img src={Logo} className={`${theme ? "invert" : "invert-0"}`}/>
        <img src={theme ? lightIcon : darkIcon} className={`${theme ? "invert" : "invert-0"} transition`} onClick={() => handleTheme(!theme)}/>
      </div>
    </div>
  )
}
