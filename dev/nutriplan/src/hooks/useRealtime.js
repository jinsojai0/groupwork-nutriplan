// Hook พื้นฐาน : เชื่อม services กับ React (onValue + useEffect + ยกเลิก Listener)
// คืนค่า { data, status, error, retry } โดย status เป็น loading, ok, empty, error หรือ idle
import { useEffect, useRef, useState } from "react";

const TIMEOUT_MS = 15000; // Realtime Database จะรอไปเรื่อย ๆ เมื่อออฟไลน์ จึงกำหนดเวลาเพื่อแสดงสถานะผิดพลาด

const defaultIsEmpty = (data) =>
  data == null || (Array.isArray(data) && data.length === 0);

/**
 * @param {string|null} key ค่าที่เปลี่ยนเมื่อต้องสมัครรับข้อมูลใหม่ (เช่น path) ถ้าเป็น null จะไม่โหลด
 * @param {(onData, onError) => () => void} subscribe ฟังก์ชันจาก services
 */
export function useRealtime(key, subscribe, isEmpty = defaultIsEmpty) {
  const [state, setState] = useState({ key: null, data: undefined, status: "loading", error: null });
  const [attempt, setAttempt] = useState(0);
  const subscribeRef = useRef(subscribe);
  const isEmptyRef = useRef(isEmpty);

  useEffect(() => {
    subscribeRef.current = subscribe;
    isEmptyRef.current = isEmpty;
  });

  useEffect(() => {
    if (key == null) return undefined;
    let received = false;
    const timer = setTimeout(() => {
      if (!received)
        setState({ key, data: undefined, status: "error", error: new Error("timeout") });
    }, TIMEOUT_MS);
    const unsubscribe = subscribeRef.current(
      (data) => {
        received = true;
        clearTimeout(timer);
        setState({ key, data, status: isEmptyRef.current(data) ? "empty" : "ok", error: null });
      },
      (error) => {
        received = true;
        clearTimeout(timer);
        console.error(`[NutriPlan] อ่านข้อมูลไม่สำเร็จ (${key})`, error);
        setState({ key, data: undefined, status: "error", error });
      },
    );
    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [key, attempt]);

  const retry = () => setAttempt((a) => a + 1);
  if (key == null) return { data: undefined, status: "idle", error: null, retry };
  // ระหว่างเปลี่ยน key ยังไม่แสดงข้อมูลของ key เดิม
  if (state.key !== key) return { data: undefined, status: "loading", error: null, retry };
  return { data: state.data, status: state.status, error: state.error, retry };
}
