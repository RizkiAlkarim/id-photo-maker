export default function FileDownloader({theme}: {theme: boolean}){
  return(
    <div className="flex flex-col">
      <button className={`flex items-center justify-center gap-2 bg-green-500 text-white border-solid ${theme ? "border-white" : "border-black"} border-2 border-b-4 border-r-4 px-4 py-2 rounded font-semibold text-black`}>
        <img src="../../public/download.svg"/>
        Download
      </button>
    </div>
  )
}
