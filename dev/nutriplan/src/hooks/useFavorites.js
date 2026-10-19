import { useMemo } from "react";
import { subscribeFavorites } from "../services/favoriteService";
import { useRealtime } from "./useRealtime";

/** รหัสเมนูโปรดของผู้ใช้ */
export function useFavorites(uid) {
  const res = useRealtime(uid ? `favorites/${uid}` : null, (ok, err) => subscribeFavorites(uid, ok, err));
  const ids = useMemo(() => res.data ?? [], [res.data]);
  const has = useMemo(() => new Set(ids), [ids]);
  return { ...res, ids, has };
}
