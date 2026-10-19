import { useMemo } from "react";
import { subscribeMealLogRange, subscribeMealLogs } from "../services/mealLogService";
import { useRealtime } from "./useRealtime";

/** บันทึกมื้ออาหารของวันหนึ่ง */
export function useMealLogs(uid, date) {
  const res = useRealtime(uid && date ? `meal_logs/${uid}/${date}` : null, (ok, err) =>
    subscribeMealLogs(uid, date, ok, err),
  );
  const logs = useMemo(() => res.data ?? [], [res.data]);
  return { ...res, logs };
}

/** บันทึกหลายวัน { "YYYY-MM-DD": [log, ...] } สำหรับสรุปรายสัปดาห์ */
export function useMealLogRange(uid, startDate, endDate) {
  const res = useRealtime(
    uid ? `meal_logs/${uid}?${startDate}..${endDate}` : null,
    (ok, err) => subscribeMealLogRange(uid, startDate, endDate, ok, err),
    (days) => !days || Object.keys(days).length === 0,
  );
  const days = useMemo(() => res.data ?? {}, [res.data]);
  return { ...res, days };
}
