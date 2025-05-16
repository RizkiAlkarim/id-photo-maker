interface Props {
  ratio: number;
  theme: boolean;
  handleRatio(ratio: number): void;
}

const ratioOption = [
  {
    id: "34",
    aspect: "3:4"
  },
  {
    id: "46",
    aspect: "4:6"
  },
]

export default function CropTool({ratio, theme, handleRatio}: Props){
  return(
      <div className="flex flex-col gap-6">
        <div className="p-4 rounded border-solid border-1">
          <p className={`${theme ? "text-white" : "text-black"} font-semibold`}>Pilih rasio:</p>
          <fieldset className="flex gap-4 items-center text-lg">
            {
              ratioOption.map(({id, aspect}) => (
                <div key={id} className="flex items-center gap-2">
                  <input id={id} type="radio" className="appearance-none checked:border-2 w-4 h-4 rounded bg-white border-solid border-black border-2 checked:bg-green-500" name="background-color" checked={ratio == Number(id)} onChange={() => handleRatio(Number(id))}/>
                  <label htmlFor={id}>{aspect}</label>
                </div>
              ))
            }
          </fieldset>
        </div>
      </div>
  )
}
