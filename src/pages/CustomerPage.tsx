import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Customer } from "../data/types";
import { ROOMS } from "../data/mock";
import { SearchableSelect } from "../components/SearchableSelect";
import { AllergenCheckboxGroup } from "../components/AllergenCheckboxGroup";
import { useCustomers } from "../hooks/useCustomers";
import { useCustomAllergens } from "../hooks/useCustomAllergens";
import { Modal } from "../components/Modal";

const CONDITIONS = ["微量NG", "少量可", "条件付き", "不明"] as const;
const CONTAMINATIONS = ["不可", "要確認", "可"] as const;

type CustomerForm = {
  name: string;
  roomName: string;
  checkInDate: string;
  allergens: string[];
  condition: string;
  contamination: string;
  notes: string;
  originalText: string;
};

function emptyForm(): CustomerForm {
  return {
    name: "",
    roomName: "",
    checkInDate: "",
    allergens: [],
    condition: "不明",
    contamination: "要確認",
    notes: "",
    originalText: "",
  };
}

function formFromCustomer(c: Customer): CustomerForm {
  return {
    name: c.name,
    roomName: c.roomName,
    checkInDate: c.checkInDate,
    allergens: [...c.allergens],
    condition: c.condition,
    contamination: c.contamination,
    notes: c.notes,
    originalText: c.originalText,
  };
}

// ─── Form View ───
function CustomerFormView({
  form,
  setForm,
  customAllergens,
  onSave,
  onCancel,
  submitLabel,
}: {
  form: CustomerForm;
  setForm: React.Dispatch<React.SetStateAction<CustomerForm>>;
  customAllergens: string[];
  onSave: () => void;
  onCancel: () => void;
  submitLabel: string;
}) {
  function toggleAllergen(name: string) {
    setForm((prev) => ({
      ...prev,
      allergens: prev.allergens.includes(name)
        ? prev.allergens.filter((a) => a !== name)
        : [...prev.allergens, name],
    }));
  }

  return (
    <div className="space-y-6">
      <button
        onClick={onCancel}
        className="text-sm text-primary hover:text-primary-dark font-medium cursor-pointer"
      >
        ← 一覧に戻る
      </button>

      <div className="bg-bg-card border border-border rounded-xl p-6 shadow-card space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">
              顧客名 <span className="text-ng">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="例: 山田 太郎"
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-bg-card placeholder:text-text-muted/50 focus:border-primary/50"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">部屋名</label>
            <SearchableSelect
              options={ROOMS.map((r) => ({ value: r, label: r }))}
              value={form.roomName}
              onChange={(v) => setForm((prev) => ({ ...prev, roomName: v as string }))}
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">チェックイン日</label>
            <input
              type="date"
              value={form.checkInDate}
              onChange={(e) => setForm((prev) => ({ ...prev, checkInDate: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-bg-card focus:border-primary/50"
            />
          </div>
        </div>

        {/* Allergens */}
        <div>
          <label className="block text-sm text-text-secondary mb-2">NGアレルゲン</label>
          <AllergenCheckboxGroup
            allergens={form.allergens}
            customAllergens={customAllergens}
            onToggle={toggleAllergen}
          />
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm text-text-secondary mb-2">重症度</label>
          <div className="flex flex-wrap gap-2">
            {CONDITIONS.map((c) => (
              <label
                key={c}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer border transition-colors ${
                  form.condition === c
                    ? "bg-primary text-white border-primary"
                    : "bg-bg-cream border-border text-text-secondary hover:border-primary/30"
                }`}
              >
                <input
                  type="radio"
                  name="condition"
                  value={c}
                  checked={form.condition === c}
                  onChange={() => setForm((prev) => ({ ...prev, condition: c }))}
                  className="sr-only"
                />
                {c}
              </label>
            ))}
          </div>
        </div>

        {/* Contamination */}
        <div>
          <label className="block text-sm text-text-secondary mb-2">コンタミ許容</label>
          <div className="flex flex-wrap gap-2">
            {CONTAMINATIONS.map((c) => (
              <label
                key={c}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer border transition-colors ${
                  form.contamination === c
                    ? "bg-primary text-white border-primary"
                    : "bg-bg-cream border-border text-text-secondary hover:border-primary/30"
                }`}
              >
                <input
                  type="radio"
                  name="contamination"
                  value={c}
                  checked={form.contamination === c}
                  onChange={() => setForm((prev) => ({ ...prev, contamination: c }))}
                  className="sr-only"
                />
                {c}
              </label>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm text-text-secondary mb-1">自由記述</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
            placeholder="補足情報を入力..."
            rows={3}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-bg-card placeholder:text-text-muted/50 focus:border-primary/50 resize-y"
          />
        </div>

        {/* Original Text */}
        <div>
          <label className="block text-sm text-text-secondary mb-1">入力原文</label>
          <textarea
            value={form.originalText}
            onChange={(e) => setForm((prev) => ({ ...prev, originalText: e.target.value }))}
            placeholder="顧客からの原文を入力..."
            rows={3}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-bg-card placeholder:text-text-muted/50 focus:border-primary/50 resize-y"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm border border-border rounded-lg text-text-secondary hover:bg-bg-cream transition-colors cursor-pointer"
          >
            キャンセル
          </button>
          <button
            onClick={onSave}
            disabled={!form.name.trim()}
            className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-light transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Customer List Page ───
export function CustomerListPage() {
  const navigate = useNavigate();
  const [customerList, setCustomerList] = useCustomers();
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);

  function confirmDelete() {
    if (!deleteTarget) return;
    setCustomerList((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/customers/new")}
          className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-light transition-colors cursor-pointer"
        >
          + 新規登録
        </button>
      </div>

      {customerList.length === 0 && (
        <div className="text-center py-12 text-text-muted text-sm">顧客が登録されていません</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {customerList.map((customer) => (
          <div
            key={customer.id}
            className="bg-bg-card border border-border rounded-xl p-5 hover:border-primary/40 hover:shadow-elevated transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-display font-medium text-base">{customer.name}</h4>
              <span className="text-[11px] px-1.5 py-0.5 bg-bg-cream border border-border-light rounded text-text-muted shrink-0">
                {customer.roomName || "—"}
              </span>
            </div>
            <p className="text-xs text-text-muted mb-2">{customer.checkInDate || "日付未設定"}</p>
            <div className="flex flex-wrap gap-1 mb-2">
              {customer.allergens.map((a) => (
                <span
                  key={a}
                  className="px-1.5 py-0.5 bg-ng-bg text-ng border border-ng-border rounded text-[11px] font-semibold"
                >
                  {a}
                </span>
              ))}
            </div>
            <div className="flex gap-2 text-[11px] text-text-muted mb-3">
              <span>{customer.condition}</span>
              <span>/ コンタミ: {customer.contamination}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/customers/edit/${customer.id}`)}
                className="px-3 py-1.5 text-xs border border-border rounded-lg text-text-secondary hover:bg-bg-cream transition-colors cursor-pointer"
              >
                編集
              </button>
              <button
                onClick={() => setDeleteTarget(customer)}
                className="px-3 py-1.5 text-xs border border-ng-border text-ng rounded-lg hover:bg-ng-bg transition-colors cursor-pointer"
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={deleteTarget !== null} onClose={() => setDeleteTarget(null)} title="顧客を削除">
        <div className="space-y-4">
          <p className="text-sm">
            <span className="font-medium">{deleteTarget?.name}</span>{" "}
            を削除してよろしいですか？この操作は取り消せません。
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setDeleteTarget(null)}
              className="px-4 py-2 text-sm border border-border rounded-lg text-text-secondary hover:bg-bg-cream transition-colors cursor-pointer"
            >
              キャンセル
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 text-sm bg-ng text-white rounded-lg hover:bg-ng/80 transition-colors cursor-pointer"
            >
              削除する
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── Customer Form Page (New / Edit) ───
export function CustomerFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [customerList, setCustomerList] = useCustomers();
  const { items: customAllergens } = useCustomAllergens();

  const isEdit = id !== undefined;
  const editCustomer = isEdit ? customerList.find((c) => c.id === Number(id)) : null;

  const [form, setForm] = useState<CustomerForm>(() =>
    editCustomer ? formFromCustomer(editCustomer) : emptyForm(),
  );

  function saveCreate() {
    if (!form.name.trim()) return;
    const newCustomer: Customer = {
      id: customerList.length > 0 ? Math.max(...customerList.map((c) => c.id)) + 1 : 1,
      name: form.name.trim(),
      roomName: form.roomName.trim(),
      checkInDate: form.checkInDate,
      allergens: form.allergens,
      condition: form.condition,
      contamination: form.contamination,
      notes: form.notes,
      originalText: form.originalText,
    };
    setCustomerList((prev) => [...prev, newCustomer]);
    navigate("/customers");
  }

  function saveEdit() {
    if (!id || !form.name.trim()) return;
    setCustomerList((prev) =>
      prev.map((c) =>
        c.id === Number(id)
          ? {
              ...c,
              name: form.name.trim(),
              roomName: form.roomName.trim(),
              checkInDate: form.checkInDate,
              allergens: form.allergens,
              condition: form.condition,
              contamination: form.contamination,
              notes: form.notes,
              originalText: form.originalText,
            }
          : c,
      ),
    );
    navigate("/customers");
  }

  if (isEdit && !editCustomer) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-text-muted">顧客が見つかりません（ID: {id}）</p>
        <button
          onClick={() => navigate("/customers")}
          className="text-sm text-primary hover:text-primary-dark font-medium cursor-pointer"
        >
          ← 一覧に戻る
        </button>
      </div>
    );
  }

  return (
    <CustomerFormView
      form={form}
      setForm={setForm}
      customAllergens={customAllergens}
      onSave={isEdit ? saveEdit : saveCreate}
      onCancel={() => navigate("/customers")}
      submitLabel={isEdit ? "保存" : "登録"}
    />
  );
}
