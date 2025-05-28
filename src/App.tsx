import Navbar from "./components/navbar.tsx"
import Container from "./components/container.tsx"
import EditMenu from "./components/edit-menu.tsx"
import {useState} from "react"

export default function App() {
  const [theme, setTheme] = useState<boolean>(false)
  function handleTheme(selectedTheme: boolean){
    setTheme(selectedTheme)
  }

  return (
    <div className={`${theme ? "bg-black text-white" : "bg-white text-black"} min-h-screen h-full max-w-screen`}>
      <Navbar handleTheme={handleTheme} theme={theme}/>
      <Container> 
        <EditMenu theme={theme}/>
      </Container>
    </div>
  )
}
