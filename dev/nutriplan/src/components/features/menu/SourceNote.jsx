import Icon from "../../common/Icon";

const STATUS = {
  VERIFIED: { text: "สอบทานแล้ว", icon: "icons/status/icon_status_verified.svg", cls: "text-green-700" },
  PENDING: { text: "ค่าประมาณ รอสอบทาน", icon: "icons/status/icon_status_pending.svg", cls: "text-amber-700" },
  REJECTED: { text: "ไม่ผ่านการสอบทาน", icon: "icons/status/icon_status_warning.svg", cls: "text-red-700" },
};

/** แหล่งอ้างอิงของค่าโภชนาการและสถานะการสอบทาน */
export default function SourceNote({ menu, source }) {
  const st = STATUS[menu.verification_status] ?? STATUS.PENDING;
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
      <span>
        ที่มา :{" "}
        {source?.url_reference?.startsWith("http") ? (
          <a href={source.url_reference} target="_blank" rel="noreferrer" className="text-brand-700 hover:underline">
            {source.name}
          </a>
        ) : (
          (source?.name ?? menu.source_id)
        )}
      </span>
      <span className={`inline-flex items-center gap-1 ${st.cls}`}>
        <Icon src={st.icon} size={16} />
        {st.text}
      </span>
      <span>ปรับปรุง {menu.updated_at}</span>
    </div>
  );
}
