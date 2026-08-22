import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: "#030712",
      }}
    >
      {/* Fixed Sidebar */}
      <div
        style={{
          width: "252px",
          height: "100vh",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        <Sidebar />
      </div>

      {/* Only this area scrolls */}
      <main
        style={{
          flex: 1,
          minWidth: 0,
          height: "100vh",
          overflowY: "auto",
          overflowX: "hidden",
          background: "#030712",

          // smoother scrolling
          scrollbarWidth: "thin",
        }}
      >
        {children}
      </main>
    </div>
  );
}