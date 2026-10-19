import MealPlanCard from "./MealPlanCard";

/** รายการแผนมื้ออาหารที่ระบบเสนอ */
export default function MealPlanList({ plans, menusById, onSave, savingIndex, savedIndex }) {
  return (
    <div className="space-y-3">
      {plans.map((p, i) => (
        <MealPlanCard
          key={i}
          plan={p}
          title={`แผนที่ ${i + 1}`}
          menusById={menusById}
          onSave={onSave ? () => onSave(p, i) : undefined}
          saving={savingIndex === i}
          saved={savedIndex === i}
        />
      ))}
    </div>
  );
}
