export default function FileUploader(){
  return (
    <div className="p-4 border-solid border-black border-2 border-b-8 border-r-8 rounded-md">
      <div className="p-32 border-dashed border-black border-2">
      {/*
      <button className="px-4 py-2 bg-black text-white rounded font-semibold">
          Unggah Gambar
        </button>
      */}  
        <input type="file" className="px-4 py-2 bg-black text-white rounded font-semibold text-center"/>
      </div>
    </div>
  )
}
