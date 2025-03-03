export default function Container({children}){
  return(
    <div className="flex justify-center items-center min-w-screen min-h-screen">
      {children}
    </div>
  )
}
