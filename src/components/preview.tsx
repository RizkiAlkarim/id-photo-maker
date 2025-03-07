export default function Preview({image, theme}){
  return(
    <div className={`${theme ? "border-white" : "border-black"} border-solid border-1`}>
      <img className="min-h-[50vh] max-h-[50vh]" src={image} />
    </div>
  )
}
