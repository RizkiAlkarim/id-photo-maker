export default function FileUploader({handleFileChange}){
  
  function loadImage(event){
    const image = event.target.files[0]

    if(event.target.files && event.target.files[0]) {
      handleFileChange(URL.createObjectURL(image))
    }
  }

  return (
    <div className="p-4 border-solid border-black border-2 border-b-8 border-r-8 rounded-md">
      <div className="relative p-32 border-dashed border-black border-2 hover:border-blue-500">
        <button className="px-4 py-2 bg-black text-white rounded font-semibold hover:bg-blue-500">
          Unggah Gambar
        </button>
        <input type="file" accept=".png, .jpg, .jpeg" className="px-4 py-2 bg-black text-white rounded font-semibold text-center absolute opacity-0 inset-0" onChange={loadImage}/>
      </div>
    </div>
  )
}
