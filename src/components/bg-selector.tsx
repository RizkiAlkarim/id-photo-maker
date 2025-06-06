interface Props {
  bgColor: string;
  theme: boolean;
  handleBgColor(color: string): void;
}
export default function BgSelector({ bgColor, handleBgColor, theme }: Props) {
  const colorOption = [
    {
      name: 'white',
      style: 'bg-[#ffffff]',
    },
    {
      name: 'red',
      style: 'bg-[#db1514]',
    },
    {
      name: 'blue',
      style: 'bg-[#0090ff]',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="p-4 rounded border-solid border-1">
        <p
          className={`${theme ? 'text-white' : 'text-black'} font-semibold mb-2`}
        >
          Pilih latar belakang
        </p>
        <fieldset className="flex gap-2 items-center">
          {colorOption.map(({ name, style }) => (
            <input
              type="radio"
              key={name}
              className={`${theme ? 'border-white' : 'border-black'} ${style} appearance-none checked:border-3 checked:border-green-500 w-8 h-8 rounded border-solid border-1 cursor-pointer`}
              name="background-color"
              checked={bgColor == name}
              onChange={() => handleBgColor(name)}
            />
          ))}
        </fieldset>
      </div>
    </div>
  );
}
