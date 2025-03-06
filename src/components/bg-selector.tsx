import MenuNavigation from "./menu-navigation.tsx"

export default function BgSelector(){
  return(
    <div className="flex flex-col gap-6">
      <div className="p-4 rounded border-solid border-1">
        <p className="text-black font-semibold mb-2">Pilih latar belakang</p>
        <fieldset className="flex gap-2 ">
          <input type="radio" className="appearance-none checked:border-2 w-8 h-8 rounded bg-white border-solid border-black checked:border-2" name="background-color"/>
          <input type="radio" className="appearance-none checked:border-2 w-8 h-8 rounded bg-red-500 border-solid border-black checked:border-2" name="background-color"/>
          <input type="radio" className="appearance-none checked:border-2 w-8 h-8 rounded bg-blue-500 border-solid border-black checked:border-2" name="background-color"/>
          <input type="radio" className="appearance-none checked:border-2 w-8 h-8 rounded bg-black border-solid border-black checked:border-2" name="background-color"/>
        </fieldset>
      </div>
    </div>
  )
}
