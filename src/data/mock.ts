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
  roomNumber: string;
};

export type Course = {
  id: number;
  name: string;
  dishes: Recipe[];
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
  {
    id: 1,
    original: "たまご粉",
    normalized: "卵",
    allergen: "含む",
    status: "要確認",
    sourceFile: "soy_sauce_spec.pdf",
  },
  {
    id: 2,
    original: "しょう油",
    normalized: "醤油",
    allergen: "不明",
    status: "要確認",
    sourceFile: "soy_sauce_spec.pdf",
  },
  {
    id: 3,
    original: "ごま油",
    normalized: "ごま油",
    allergen: "含まない",
    status: "確定",
    sourceFile: "label_aji_miso.jpg",
  },
  {
    id: 4,
    original: "小麦粉（国産）",
    normalized: "小麦",
    allergen: "含む",
    status: "確定",
    sourceFile: "ingredients_2026_02.csv",
  },
  {
    id: 5,
    original: "みりん風調味料",
    normalized: "みりん",
    allergen: "不明",
    status: "要確認",
    sourceFile: "ingredients_2026_02.csv",
  },
  {
    id: 6,
    original: "かつおエキス",
    normalized: "かつお",
    allergen: "含まない",
    status: "確定",
    sourceFile: "label_aji_miso.jpg",
  },
  {
    id: 7,
    original: "乳化剤（大豆由来）",
    normalized: "大豆",
    allergen: "含む",
    status: "要確認",
    sourceFile: "dashi_components.xlsx",
  },
];

export const availableIngredients: Ingredient[] = [
  { id: 1, name: "銀鱈", category: "主食材", allergens: [] },
  { id: 2, name: "和牛A5", category: "主食材", allergens: [] },
  { id: 3, name: "車えび", category: "主食材", allergens: ["えび"] },
  { id: 4, name: "鯛", category: "主食材", allergens: [] },
  { id: 5, name: "白味噌", category: "調味料", allergens: ["大豆"] },
  { id: 6, name: "みりん", category: "調味料", allergens: [] },
  { id: 7, name: "醤油", category: "調味料", allergens: ["大豆", "小麦"], allergenUnknown: true },
  { id: 8, name: "料理酒", category: "調味料", allergens: [] },
  { id: 9, name: "基本出汁", category: "共通仕込み", allergens: [] },
  {
    id: 10,
    name: "醤油タレ",
    category: "共通仕込み",
    allergens: ["大豆", "小麦"],
    allergenUnknown: true,
  },
  { id: 11, name: "天ぷら衣", category: "共通仕込み", allergens: ["卵", "小麦"] },
  { id: 12, name: "味噌ダレ", category: "共通仕込み", allergens: ["大豆"] },
];

// ─── Recipes ───

export const recipes: Recipe[] = [
  {
    id: 1,
    name: "銀鱈の西京焼き",
    version: "v2026-02",
    linkedIngredients: [
      { id: 1, name: "銀鱈", category: "主食材", allergens: [] },
      { id: 5, name: "白味噌", category: "調味料", allergens: ["大豆"] },
      { id: 6, name: "みりん", category: "調味料", allergens: [] },
      { id: 9, name: "基本出汁", category: "共通仕込み", allergens: [] },
    ],
  },
  {
    id: 2,
    name: "先付（季節の前菜）",
    version: "v2026-02",
    linkedIngredients: [
      { id: 4, name: "鯛", category: "主食材", allergens: [] },
      {
        id: 7,
        name: "醤油",
        category: "調味料",
        allergens: ["大豆", "小麦"],
        allergenUnknown: true,
      },
      { id: 9, name: "基本出汁", category: "共通仕込み", allergens: [] },
    ],
  },
  {
    id: 3,
    name: "天ぷら盛り合わせ",
    version: "v2026-01",
    linkedIngredients: [
      { id: 3, name: "車えび", category: "主食材", allergens: ["えび"] },
      { id: 11, name: "天ぷら衣", category: "共通仕込み", allergens: ["卵", "小麦"] },
      { id: 8, name: "料理酒", category: "調味料", allergens: [] },
    ],
  },
  {
    id: 4,
    name: "和牛すき焼き",
    version: "v2026-02",
    linkedIngredients: [
      { id: 2, name: "和牛A5", category: "主食材", allergens: [] },
      {
        id: 7,
        name: "醤油",
        category: "調味料",
        allergens: ["大豆", "小麦"],
        allergenUnknown: true,
      },
      { id: 6, name: "みりん", category: "調味料", allergens: [] },
      {
        id: 10,
        name: "醤油タレ",
        category: "共通仕込み",
        allergens: ["大豆", "小麦"],
        allergenUnknown: true,
      },
    ],
  },
  {
    id: 5,
    name: "抹茶プリン",
    version: "v2026-01",
    linkedIngredients: [{ id: 12, name: "味噌ダレ", category: "共通仕込み", allergens: ["大豆"] }],
  },
];

// ─── Customers ───

export const customers: Customer[] = [
  {
    id: 1,
    name: "山田 太郎",
    allergens: ["卵", "えび"],
    condition: "微量NG",
    contamination: "不可",
    checkInDate: "2026-02-07",
    roomNumber: "松の間 301",
  },
  {
    id: 2,
    name: "佐藤 花子",
    allergens: ["小麦", "大豆"],
    condition: "少量可",
    contamination: "要確認",
    checkInDate: "2026-02-08",
    roomNumber: "竹の間 205",
  },
  {
    id: 3,
    name: "田中 一郎",
    allergens: ["乳", "落花生", "くるみ"],
    condition: "微量NG",
    contamination: "不可",
    checkInDate: "2026-02-09",
    roomNumber: "梅の間 102",
  },
];

// ─── Courses ───

export const courses: Course[] = [
  {
    id: 1,
    name: "2月特別懐石コース",
    dishes: [recipes[1], recipes[0], recipes[2], recipes[3], recipes[4]],
  },
  {
    id: 2,
    name: "お祝い会席コース",
    dishes: [recipes[1], recipes[0], recipes[3], recipes[4]],
  },
];
