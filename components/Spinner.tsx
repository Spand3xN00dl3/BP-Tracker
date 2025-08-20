export default function Spinner({ size=24 }: { size?: number }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className="rounded-full border-2 border-header border-t-color1 animate-spin"
        style={{ width: size, height: size }}
      />
    </div>
  );
}
