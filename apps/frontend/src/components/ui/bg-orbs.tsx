export default function BgOrbs() {
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      <div style={{
        position: "absolute", top: "-10%", left: "-5%",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,111,205,0.2) 0%, transparent 70%)",
        filter: "blur(40px)", animation: "glow-pulse 4s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", top: "20%", right: "-10%",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,212,255,0.13) 0%, transparent 70%)",
        filter: "blur(60px)", animation: "glow-pulse 4s ease-in-out infinite",
        animationDelay: "2s",
      }} />
      <div style={{
        position: "absolute", bottom: "5%", left: "30%",
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,255,170,0.09) 0%, transparent 70%)",
        filter: "blur(50px)", animation: "glow-pulse 4s ease-in-out infinite",
        animationDelay: "1s",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }} />
    </div>
  );
}