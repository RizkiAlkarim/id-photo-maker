export default function Navbar({theme, handleTheme}){
  return (
    <div className="min-h-[10%] px-12 py-5 border-solid border-b-2">
      <div className="flex justify-between items-center">
        <img src="../../public/logo.png" className={`${theme ? "invert" : "invert-0"}`}/>
        <img src={`../../public/${theme ? "light" : "dark"}.png`} className={`${theme ? "invert" : "invert-0"} transition`} onClick={() => handleTheme(!theme)}/>
      </div>
    </div>
  )
}
