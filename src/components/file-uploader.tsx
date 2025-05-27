interface Props {
  theme: boolean;
  handleOriginalFile(file: File): void;
  handleCurrentMenu(currentMenu: string): void;
  handleFileChange(imageData: any): void;
}

export default function FileUploader({theme, handleOriginalFile, handleFileChange, handleCurrentMenu}: Props){
  
  function loadImage(event: React.ChangeEvent<HTMLInputElement>){
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const image = event.target.files[0]
    handleOriginalFile(image)
    if(event.target.files && event.target.files[0]) {
      handleFileChange(URL.createObjectURL(image))
      handleCurrentMenu("edit")
    }
  }

  return (
      <div className={`${theme ? "bg-black text-white border-white" : "bg-white text-black border-black"} flex items-center justify-center relative p-32 border-dashed border-2 hover:border-green-500 w-full`}>
        <button className={`${!theme ? "bg-black text-white" : "bg-white text-black"} px-4 py-2 rounded font-semibold`}>
          Unggah Gambar
        </button>
        <input
          type="file"
          accept=".png, .jpg, .jpeg"
          className={`px-4 py-2 text-white rounded font-semibold text-center absolute opacity-0 inset-0 cursor-pointer`}
          onChange={loadImage}
        />
      </div>
  )
}
