export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center items-center lg:items-center min-h-[90vh]">
      {children}
    </div>
  );
}
