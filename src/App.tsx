import Navbar from "./components/navbar.tsx"
import FileUploader from "./components/file-uploader.tsx"
import Container from "./components/container.tsx"
import EditMenu from "./components/edit-menu.tsx"
import {useState, useEffect} from "react"

export default function App() {
  const [file, setFile] = useState(null)

  function handleFileChange(imageData){
    setFile(imageData)
  } 

  return (
    <div className="h-screen max-w-screen">
      <Navbar />
      <Container> 
        {
          !file ? <FileUploader handleFileChange={handleFileChange} /> : <EditMenu image={file}/>
        }
      </Container>
    </div>
  )
}
