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

// ─── Recipes ───

export const recipes: Recipe[] = [
  {
    id: 1,
    name: "銀鱈の西京焼き",
    version: "v2026-02",
    linkedIngredients: [
      { id: 1, name: "銀鱈", category: "主食材" },
      { id: 5, name: "白味噌", category: "調味料" },
      { id: 6, name: "みりん", category: "調味料" },
      { id: 9, name: "基本出汁", category: "共通仕込み" },
    ],
  },
  {
    id: 2,
    name: "先付（季節の前菜）",
    version: "v2026-02",
    linkedIngredients: [
      { id: 4, name: "鯛", category: "主食材" },
      { id: 7, name: "醤油", category: "調味料" },
      { id: 9, name: "基本出汁", category: "共通仕込み" },
    ],
  },
  {
    id: 3,
    name: "天ぷら盛り合わせ",
    version: "v2026-01",
    linkedIngredients: [
      { id: 3, name: "車えび", category: "主食材" },
      { id: 11, name: "天ぷら衣", category: "共通仕込み" },
      { id: 8, name: "料理酒", category: "調味料" },
    ],
  },
  {
    id: 4,
    name: "和牛すき焼き",
    version: "v2026-02",
    linkedIngredients: [
      { id: 2, name: "和牛A5", category: "主食材" },
      { id: 7, name: "醤油", category: "調味料" },
      { id: 6, name: "みりん", category: "調味料" },
      { id: 10, name: "醤油タレ", category: "共通仕込み" },
    ],
  },
  {
    id: 5,
    name: "抹茶プリン",
    version: "v2026-01",
    linkedIngredients: [{ id: 12, name: "味噌ダレ", category: "共通仕込み" }],
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

// Alias for backward compatibility
export const guest = customers[0];

// ─── Match Results by Customer ───

export const matchResultsByCustomer: Record<number, MatchResult[]> = {
  1: [
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
  ],
  2: [
    {
      id: 1,
      dish: "先付（季節の前菜）",
      judgment: "要確認",
      reason: "醤油に小麦・大豆が含まれる可能性",
      details: [
        "醤油のアレルゲン属性が「不明」",
        "小麦・大豆を含む可能性あり",
        "仕入先への確認が必要",
      ],
    },
    {
      id: 2,
      dish: "焼物（銀鱈の西京焼き）",
      judgment: "NG",
      reason: "白味噌に大豆を含有",
      details: [
        "白味噌の原材料に大豆含有",
        "顧客NGアレルゲン「大豆」と一致",
        "醤油も大豆由来の可能性あり",
      ],
    },
    {
      id: 3,
      dish: "甘味（抹茶プリン）",
      judgment: "OK",
      reason: "該当アレルゲンなし",
      details: ["使用食材: 抹茶、砂糖、ゼラチン、牛乳", "顧客NG「小麦」「大豆」は不含有"],
    },
    {
      id: 4,
      dish: "天ぷら盛り合わせ",
      judgment: "NG",
      reason: "天ぷら衣に小麦粉を使用",
      details: ["天ぷら衣に「小麦粉」→「小麦」に該当", "顧客NGアレルゲン「小麦」と一致"],
    },
    {
      id: 5,
      dish: "和牛すき焼き",
      judgment: "NG",
      reason: "割り下に醤油（大豆・小麦）使用",
      details: [
        "醤油に大豆・小麦含有",
        "顧客NGアレルゲン「大豆」「小麦」と一致",
        "醤油タレにも醤油使用",
      ],
    },
  ],
  3: [
    {
      id: 1,
      dish: "先付（季節の前菜）",
      judgment: "OK",
      reason: "該当アレルゲンなし",
      details: ["乳・落花生・くるみは不含有"],
    },
    {
      id: 2,
      dish: "焼物（銀鱈の西京焼き）",
      judgment: "OK",
      reason: "該当アレルゲンなし",
      details: ["乳・落花生・くるみは不含有"],
    },
    {
      id: 3,
      dish: "甘味（抹茶プリン）",
      judgment: "NG",
      reason: "牛乳（乳）を含有",
      details: ["使用食材に「牛乳」→「乳」に該当", "顧客NGアレルゲン「乳」と一致"],
    },
    {
      id: 4,
      dish: "天ぷら盛り合わせ",
      judgment: "OK",
      reason: "該当アレルゲンなし",
      details: ["乳・落花生・くるみは不含有"],
    },
    {
      id: 5,
      dish: "和牛すき焼き",
      judgment: "OK",
      reason: "該当アレルゲンなし",
      details: ["乳・落花生・くるみは不含有"],
    },
  ],
};

// Alias for backward compatibility
export const matchResults = matchResultsByCustomer[1];

// ─── Judgment by Customer ───

export const judgmentRowsByCustomer: Record<number, JudgmentRow[]> = {
  1: [
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
  ],
  2: [
    {
      id: 1,
      dish: "焼物（銀鱈の西京焼き）",
      judgment: "NG",
      reason: "白味噌に大豆を含有",
      approval: "未承認",
    },
    { id: 2, dish: "甘味（抹茶プリン）", judgment: "OK", reason: "該当なし", approval: "承認済" },
    {
      id: 3,
      dish: "天ぷら盛り合わせ",
      judgment: "NG",
      reason: "天ぷら衣に小麦粉を使用",
      approval: "未承認",
    },
    {
      id: 4,
      dish: "和牛すき焼き",
      judgment: "NG",
      reason: "割り下に醤油（大豆・小麦）使用",
      approval: "未承認",
    },
  ],
  3: [
    {
      id: 1,
      dish: "甘味（抹茶プリン）",
      judgment: "NG",
      reason: "牛乳（乳）を含有",
      approval: "承認済",
    },
  ],
};

export const pendingRowsByCustomer: Record<number, PendingRow[]> = {
  1: [
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
  ],
  2: [
    {
      id: 1,
      item: "醤油（銘柄X）",
      reason: "小麦・大豆の含有確認",
      assignee: "仕入/購買",
      deadline: "今日 17:00",
      status: "未対応",
    },
  ],
  3: [],
};

// Aliases for backward compatibility
export const judgmentRows = judgmentRowsByCustomer[1];
export const pendingRows = pendingRowsByCustomer[1];
