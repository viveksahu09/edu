import { useTheme } from "../../context/ThemeContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isDarkMode } = useTheme();

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-vector/flat-background-world-teacher-s-day-celebration_23-2150722546.jpg?t=st=1735232475~exp=1735236075~hmac=ed48e5467a8e5240cfd3e7bf44c2a845b7ec217423a49d629ec850a85a3aeaa2&w=996')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div
        className={`absolute inset-0 ${
          isDarkMode ? "bg-gray-900/90" : "bg-white/90"
        } mix-blend-multiply`}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
