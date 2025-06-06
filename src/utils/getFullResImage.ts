export default function getFullResImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve(img);
    };
    img.src = URL.createObjectURL(file);
  });
}
