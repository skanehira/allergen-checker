// ─── Types ───

export type ImportStatus = "取込完了" | "抽出済み" | "OCR中" | "エラー";
export type FileType = "規格書" | "ラベル" | "CSV" | "Excel";
export type AllergenAttr = "含む" | "含まない" | "不明";
export type NormStatus = "確定" | "要確認";
export type Judgment = "OK" | "要確認" | "NG";
export type ApprovalStatus = "承認済" | "未承認";
export type TaskStatus = "未対応" | "対応中" | "対応済";
export type IngredientCategory = "主食材" | "調味料" | "共通仕込み";

export type ImportQueueItem = {
  id: number;
  fileName: string;
  fileType: FileType;
  extractedCount: number;
  status: ImportStatus;
};

export type NormalizationItem = {
  id: number;
  original: string;
  normalized: string;
  allergen: AllergenAttr;
  status: NormStatus;
};

export type Ingredient = {
  id: number;
  name: string;
  category: IngredientCategory;
};

export type MatchResult = {
  id: number;
  dish: string;
  judgment: Judgment;
  reason: string;
  details: string[];
};

export type JudgmentRow = {
  id: number;
  dish: string;
  judgment: Judgment;
  reason: string;
  approval: ApprovalStatus;
};

export type PendingRow = {
  id: number;
  item: string;
  reason: string;
  assignee: string;
  deadline: string;
  status: TaskStatus;
};

// ─── Mock Data ───

export const importQueue: ImportQueueItem[] = [
  {
    id: 101,
    fileName: "soy_sauce_spec.pdf",
    fileType: "規格書",
    extractedCount: 24,
    status: "抽出済み",
  },
  {
    id: 102,
    fileName: "label_aji_miso.jpg",
    fileType: "ラベル",
    extractedCount: 18,
    status: "OCR中",
  },
  {
    id: 103,
    fileName: "ingredients_2026_02.csv",
    fileType: "CSV",
    extractedCount: 42,
    status: "取込完了",
  },
  {
    id: 104,
    fileName: "dashi_components.xlsx",
    fileType: "Excel",
    extractedCount: 0,
    status: "エラー",
  },
];

export const normalizationItems: NormalizationItem[] = [
  { id: 1, original: "たまご粉", normalized: "卵", allergen: "含む", status: "要確認" },
  { id: 2, original: "しょう油", normalized: "醤油", allergen: "不明", status: "要確認" },
  { id: 3, original: "ごま油", normalized: "ごま油", allergen: "含まない", status: "確定" },
  { id: 4, original: "小麦粉（国産）", normalized: "小麦", allergen: "含む", status: "確定" },
  { id: 5, original: "みりん風調味料", normalized: "みりん", allergen: "不明", status: "要確認" },
  { id: 6, original: "かつおエキス", normalized: "かつお", allergen: "含まない", status: "確定" },
  { id: 7, original: "乳化剤（大豆由来）", normalized: "大豆", allergen: "含む", status: "要確認" },
];

export const availableIngredients: Ingredient[] = [
  { id: 1, name: "銀鱈", category: "主食材" },
  { id: 2, name: "和牛A5", category: "主食材" },
  { id: 3, name: "車えび", category: "主食材" },
  { id: 4, name: "鯛", category: "主食材" },
  { id: 5, name: "白味噌", category: "調味料" },
  { id: 6, name: "みりん", category: "調味料" },
  { id: 7, name: "醤油", category: "調味料" },
  { id: 8, name: "料理酒", category: "調味料" },
  { id: 9, name: "基本出汁", category: "共通仕込み" },
  { id: 10, name: "醤油タレ", category: "共通仕込み" },
  { id: 11, name: "天ぷら衣", category: "共通仕込み" },
  { id: 12, name: "味噌ダレ", category: "共通仕込み" },
];

export const initialLinked: Ingredient[] = [
  { id: 1, name: "銀鱈", category: "主食材" },
  { id: 5, name: "白味噌", category: "調味料" },
  { id: 6, name: "みりん", category: "調味料" },
  { id: 9, name: "基本出汁", category: "共通仕込み" },
];

export const guest = {
  name: "山田 太郎",
  allergens: ["卵", "えび"],
  condition: "微量NG",
  contamination: "不可",
};

export const matchResults: MatchResult[] = [
  {
    id: 1,
    dish: "先付（季節の前菜）",
    judgment: "NG",
    reason: "卵（衣）を含有",
    details: [
      "食材「たまご粉」→ 正規化名「卵」に該当",
      "顧客NGアレルゲン「卵」と一致",
      "微量NGのため除去不可",
    ],
  },
  {
    id: 2,
    dish: "焼物（銀鱈の西京焼き）",
    judgment: "要確認",
    reason: "醤油の原材料が不明",
    details: [
      "白味噌の原材料に大豆含有（顧客NG対象外）",
      "醤油のアレルゲン属性が「不明」",
      "仕入先への確認が必要",
    ],
  },
  {
    id: 3,
    dish: "甘味（抹茶プリン）",
    judgment: "OK",
    reason: "該当アレルゲンなし",
    details: ["使用食材: 抹茶、砂糖、ゼラチン、牛乳", "顧客NG「卵」「えび」は不含有"],
  },
  {
    id: 4,
    dish: "天ぷら盛り合わせ",
    judgment: "NG",
    reason: "えび、卵（衣）を含有",
    details: [
      "車えび → 顧客NG「えび」に該当",
      "天ぷら衣に「たまご粉」→「卵」に該当",
      "2種のNGアレルゲンを含有",
    ],
  },
  {
    id: 5,
    dish: "和牛すき焼き",
    judgment: "要確認",
    reason: "割り下の醤油が不明",
    details: [
      "割り下に醤油を使用",
      "醤油のアレルゲン属性が「不明」",
      "小麦由来の可能性あり（確認推奨）",
    ],
  },
];

export const judgmentRows: JudgmentRow[] = [
  {
    id: 1,
    dish: "先付（季節の前菜）",
    judgment: "NG",
    reason: "卵（衣）を含有",
    approval: "未承認",
  },
  { id: 2, dish: "甘味（抹茶プリン）", judgment: "OK", reason: "該当なし", approval: "承認済" },
  {
    id: 3,
    dish: "天ぷら盛り合わせ",
    judgment: "NG",
    reason: "えび、卵（衣）を含有",
    approval: "未承認",
  },
];

export const pendingRows: PendingRow[] = [
  {
    id: 1,
    item: "醤油（銘柄X）",
    reason: "原材料詳細が不明",
    assignee: "仕入/購買",
    deadline: "今日 17:00",
    status: "未対応",
  },
  {
    id: 2,
    item: "みりん風調味料",
    reason: "アレルゲン属性が不明",
    assignee: "仕入/購買",
    deadline: "今日 17:00",
    status: "対応中",
  },
];
