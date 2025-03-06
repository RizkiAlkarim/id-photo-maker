import Navbar from "./components/navbar.tsx"
import FileUploader from "./components/file-uploader.tsx"
import Container from "./components/container.tsx"
import EditMenu from "./components/edit-menu.tsx"
import {useState, useEffect} from "react"

export default function App() {

  return (
    <div className="h-screen max-w-screen">
      <Navbar />
      <Container> 
        <EditMenu/>
      </Container>
    </div>
  )
}
