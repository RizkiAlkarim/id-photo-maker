export default function Preview({image}){
  return(
    <div className="border-solid border-1">
      <img className="min-h-[50vh] max-h-[50vh]" src={image} />
    </div>
  )
}
