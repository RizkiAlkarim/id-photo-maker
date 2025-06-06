import { useState } from 'react';

export default function useImage() {
  const [image, setImage] = useState<string | null>(null);

  function handleImageChange(imageData: string) {
    setImage(imageData);
  }

  return {
    image,
    handleImageChange,
  };
}
