// สถานะที่ใช้ทั้งแอป : ผู้ใช้ปัจจุบันและบทบาท (member, editor, admin)
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthChange, subscribeRole } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [roleState, setRoleState] = useState({ uid: null, role: null });

  useEffect(
    () =>
      onAuthChange((u) => {
        setUser(u);
        setAuthReady(true);
      }),
    [],
  );

  const uid = user?.uid ?? null;
  useEffect(() => {
    if (!uid) return undefined;
    return subscribeRole(
      uid,
      (role) => setRoleState({ uid, role }),
      () => setRoleState({ uid, role: "member" }),
    );
  }, [uid]);

  const role = uid && roleState.uid === uid ? roleState.role : null;
  const loading = !authReady || (uid != null && role == null);

  const value = {
    user,
    uid,
    role: role ?? "member",
    loading,
    isEditor: role === "editor" || role === "admin",
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth ต้องใช้ภายใน <AuthProvider>");
  return ctx;
}
