import MenuNavigation from "./menu-navigation.tsx"

export default function CropTool({handleRatio, ratio}){
  return(
      <div className="flex flex-col gap-6">
        <div className="p-4 rounded border-solid border-1">
          <p className="text-black font-semibold">Pilih rasio:</p>
          <fieldset className="flex gap-2 items-center text-lg">
              <input id="46" type="radio" className="appearance-none checked:border-2 w-4 h-4 rounded bg-white border-solid border-black border-2 checked:bg-blue-500" name="background-color" checked={ratio == "46"} onChange={() => handleRatio("46")}/>
              <label htmlFor="46">4:6</label>
              <input id="34" type="radio" className="appearance-none checked:border-2 w-4 h-4 rounded bg-white border-solid border-black border-2 checked:bg-blue-500" name="background-color" checked={ratio == "34"} onChange={() => handleRatio("34")}/>
            <label htmlFor="34">3:4</label>
          </fieldset>
        </div>
      </div>
  )
}
