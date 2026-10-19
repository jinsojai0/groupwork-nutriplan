import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@fontsource/sarabun/400.css";
import "@fontsource/sarabun/600.css";
import "@fontsource/sarabun/700.css";
import "./styles/index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import App from "./App.jsx";

// จุดเริ่มต้นของแอป : BrowserRouter ครอบทั้งแอปเพื่อใช้ Routing และ AuthProvider ให้ทุกหน้าทราบผู้ใช้ปัจจุบัน
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
