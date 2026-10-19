import { subscribeUser } from "../services/userService";
import { useRealtime } from "./useRealtime";

/** users/{uid} : display_name, profile, targets, consent_at */
export function useProfile(uid) {
  const res = useRealtime(uid ? `users/${uid}` : null, (ok, err) => subscribeUser(uid, ok, err));
  const user = res.data ?? null;
  return {
    ...res,
    userData: user,
    profile: user?.profile ?? null,
    targets: user?.targets ?? null,
    consentAt: user?.consent_at ?? null,
  };
}
