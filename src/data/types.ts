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
  sourceFile: string;
};

export type Ingredient = {
  id: number;
  name: string;
  category: IngredientCategory;
  allergens: string[];
  allergenUnknown?: boolean;
};

export type Recipe = {
  id: number;
  name: string;
  version: string;
  linkedIngredients: Ingredient[];
};

export type Customer = {
  id: number;
  name: string;
  allergens: string[];
  condition: string;
  contamination: string;
  checkInDate: string;
  roomName: string;
  notes: string;
  originalText: string;
};

export type Course = {
  id: number;
  name: string;
  dishes: Recipe[];
};

// ─── 特定原材料28品目 ───

export type AllergenCategory = "義務表示" | "推奨表示" | "カスタム";

export type AllergenItem = {
  name: string;
  category: AllergenCategory;
};
