export default function BgOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* primary accent orb */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "15%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(124,106,247,0.18) 0%, transparent 70%)",
          animation: "orb-drift 18s ease-in-out infinite",
          filter: "blur(40px)",
        }}
      />
      {/* secondary accent orb */}
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          right: "10%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(79,196,207,0.15) 0%, transparent 70%)",
          animation: "orb-drift 24s ease-in-out infinite reverse",
          filter: "blur(40px)",
        }}
      />
      {/* subtle mid orb */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "55%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(124,106,247,0.08) 0%, transparent 70%)",
          animation: "orb-drift 30s ease-in-out infinite",
          filter: "blur(60px)",
        }}
      />
    </div>
  );
}