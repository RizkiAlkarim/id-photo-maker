export default function FileUploader({handleFileChange, handleCurrentMenu, theme}){
  
  function loadImage(event){
    const image = event.target.files[0]

    if(event.target.files && event.target.files[0]) {
      handleFileChange(URL.createObjectURL(image))
      handleCurrentMenu("crop")
    }
  }

  return (
      <div className={`${theme ? "bg-black text-white border-white" : "bg-white text-black border-black"} flex items-center justify-center relative p-32 border-dashed border-2 hover:border-green-500 w-full`}>
        <button className={`${!theme ? "bg-black text-white" : "bg-white text-black"} px-4 py-2 rounded font-semibold`}>
          Unggah Gambar
        </button>
        <input type="file" accept=".png, .jpg, .jpeg" className={`px-4 py-2 text-white rounded font-semibold text-center absolute opacity-0 inset-0 cursor-pointer`} onChange={loadImage}/>
      </div>
  )
}
