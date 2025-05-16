export default function Container({children}: {children: React.ReactNode}){
  return(
    <div className="flex justify-center items-center min-h-[90%]">
      {children}
    </div>
  )
}
