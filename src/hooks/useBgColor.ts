import { useState } from 'react';

export default function useBgColor(defaultBgColor: string) {
  const [bgColor, setBgColor] = useState<string>(defaultBgColor);
  function handleBgColor(selectedBgColor: string) {
    setBgColor(selectedBgColor);
  }

  return {
    bgColor,
    handleBgColor,
  };
}
