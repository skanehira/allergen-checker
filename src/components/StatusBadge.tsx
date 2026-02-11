import type {
  Judgment,
  NormStatus,
  ApprovalStatus,
  AllergenAttr,
  ImportStatus,
  TaskStatus,
  AssignmentStatus,
} from "../data/mock";

type Variant =
  | Judgment
  | NormStatus
  | ApprovalStatus
  | AllergenAttr
  | ImportStatus
  | TaskStatus
  | AssignmentStatus;

const styles: Record<string, string> = {
  OK: "bg-ok-bg text-ok border-ok-border",
  含まない: "bg-ok-bg text-ok border-ok-border",
  確定: "bg-ok-bg text-ok border-ok-border",
  承認済: "bg-ok-bg text-ok border-ok-border",
  取込完了: "bg-ok-bg text-ok border-ok-border",
  対応済: "bg-ok-bg text-ok border-ok-border",
  確認済: "bg-ok-bg text-ok border-ok-border",
  要確認: "bg-caution-bg text-caution border-caution-border",
  不明: "bg-caution-bg text-caution border-caution-border",
  対応中: "bg-caution-bg text-caution border-caution-border",
  未確認: "bg-caution-bg text-caution border-caution-border",
  抽出済み: "bg-[#eef2ff] text-[#4338ca] border-[#c7d2fe]",
  OCR中: "bg-[#eef2ff] text-[#4338ca] border-[#c7d2fe]",
  厨房共有済: "bg-[#eef2ff] text-[#4338ca] border-[#c7d2fe]",
  NG: "bg-ng-bg text-ng border-ng-border",
  未承認: "bg-ng-bg text-ng border-ng-border",
  エラー: "bg-ng-bg text-ng border-ng-border",
  未対応: "bg-ng-bg text-ng border-ng-border",
  含む: "bg-ng-bg text-ng border-ng-border",
};

export function StatusBadge({ value }: { value: Variant }) {
  const cls = styles[value] ?? "bg-gray-100 text-gray-600 border-gray-200";
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      {value}
    </span>
  );
}
