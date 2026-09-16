// Honeycomb mark inspired by the 2016 brand identity. Replace with the original logo file when imported.
export function Honeycomb({ size = 30 }: { size?: number }) {
  const hex = (cx: number, cy: number, r: number) => {
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i + Math.PI / 6;
      pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
    }
    return pts.join(' ');
  };
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      <polygon points={hex(35, 33, 17)} fill="#e2a13c" />
      <polygon points={hex(65, 33, 17)} fill="#bbb0a6" />
      <polygon points={hex(50, 59, 17)} fill="#e2a13c" />
      <polygon points={hex(20, 59, 17)} fill="#bbb0a6" />
      <polygon points={hex(80, 59, 17)} fill="#bbb0a6" />
      <polygon points={hex(35, 85, 17)} fill="#bbb0a6" />
      <polygon points={hex(65, 85, 17)} fill="#e2a13c" />
    </svg>
  );
}
