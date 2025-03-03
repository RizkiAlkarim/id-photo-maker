import Navbar from "./components/navbar.tsx"
import FileUploader from "./components/file-uploader.tsx"
import Container from "./components/container.tsx"

export default function App() {
  return (
    <>
      <Navbar />
      <Container>
        <FileUploader/>
      </Container>
    </>
  )
}
