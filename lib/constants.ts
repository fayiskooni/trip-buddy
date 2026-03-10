export function getTripColor(seed?: string | number | null) {
  if (!seed) return "hsl(210, 100%, 95%)"; // light blue fallback
  
  const str = String(seed);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate a pleasant light background color (HSL: hue 0-360, sat 70-90%, lightness 85-95%)
  const hue = Math.abs(hash % 360);
  const sat = 70 + Math.abs(hash % 20); // 70-90%
  const light = 85 + Math.abs(hash % 10); // 85-95%
  
  return `hsl(${hue}, ${sat}%, ${light}%)`;
}
