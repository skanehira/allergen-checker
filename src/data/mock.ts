export type {
  ImportStatus,
  FileType,
  AllergenAttr,
  NormStatus,
  Judgment,
  ApprovalStatus,
  TaskStatus,
  IngredientCategory,
  ImportQueueItem,
  Ingredient,
  Recipe,
  Customer,
  Course,
  AllergenCategory,
  AllergenItem,
  RawMaterial,
  ImportedIngredient,
  AssignmentStatus,
  CustomIngredient,
  DishCustomization,
  CustomerCourseAssignment,
} from "./types";

import type {
  ImportQueueItem,
  Ingredient,
  Recipe,
  Customer,
  Course,
  AllergenItem,
  ImportedIngredient,
} from "./types";

// ─── 特定原材料28品目 ───

export const allergen28Items: AllergenItem[] = [
  // 特定原材料8品目（義務表示）
  { name: "えび", category: "義務表示" },
  { name: "かに", category: "義務表示" },
  { name: "くるみ", category: "義務表示" },
  { name: "小麦", category: "義務表示" },
  { name: "そば", category: "義務表示" },
  { name: "卵", category: "義務表示" },
  { name: "乳", category: "義務表示" },
  { name: "落花生", category: "義務表示" },
  // 特定原材料に準ずるもの20品目（推奨表示）
  { name: "アーモンド", category: "推奨表示" },
  { name: "あわび", category: "推奨表示" },
  { name: "いか", category: "推奨表示" },
  { name: "いくら", category: "推奨表示" },
  { name: "オレンジ", category: "推奨表示" },
  { name: "カシューナッツ", category: "推奨表示" },
  { name: "キウイフルーツ", category: "推奨表示" },
  { name: "牛肉", category: "推奨表示" },
  { name: "ごま", category: "推奨表示" },
  { name: "さけ", category: "推奨表示" },
  { name: "さば", category: "推奨表示" },
  { name: "大豆", category: "推奨表示" },
  { name: "鶏肉", category: "推奨表示" },
  { name: "バナナ", category: "推奨表示" },
  { name: "豚肉", category: "推奨表示" },
  { name: "まつたけ", category: "推奨表示" },
  { name: "もも", category: "推奨表示" },
  { name: "やまいも", category: "推奨表示" },
  { name: "りんご", category: "推奨表示" },
  { name: "ゼラチン", category: "推奨表示" },
];

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

// ─── 仕入れ食材（正規化確認用） ───

export const importedIngredients: ImportedIngredient[] = [
  {
    id: 1,
    sourceFile: "soy_sauce_spec.pdf",
    name: "醤油（丸大豆）",
    rawMaterials: [
      { name: "大豆", allergens: ["大豆"] },
      { name: "小麦", allergens: ["小麦"] },
      { name: "食塩", allergens: [] },
      { name: "アルコール", allergens: [] },
    ],
    status: "確定",
  },
  {
    id: 2,
    sourceFile: "soy_sauce_spec.pdf",
    name: "白味噌",
    rawMaterials: [
      { name: "大豆", allergens: ["大豆"] },
      { name: "米", allergens: [] },
      { name: "食塩", allergens: [] },
    ],
    status: "確定",
  },
  {
    id: 3,
    sourceFile: "label_aji_miso.jpg",
    name: "みりん風調味料",
    rawMaterials: [
      { name: "水飴", allergens: [] },
      { name: "醸造酢", allergens: [] },
      { name: "米", allergens: [] },
      { name: "アルコール", allergens: [] },
    ],
    status: "要確認",
  },
  {
    id: 4,
    sourceFile: "ingredients_2026_02.csv",
    name: "天ぷら粉",
    rawMaterials: [
      { name: "小麦粉", allergens: ["小麦"] },
      { name: "でんぷん", allergens: [] },
      { name: "卵白粉", allergens: ["卵"] },
      { name: "ベーキングパウダー", allergens: [] },
    ],
    status: "確定",
  },
  {
    id: 5,
    sourceFile: "label_aji_miso.jpg",
    name: "出汁パック",
    rawMaterials: [
      { name: "かつお節", allergens: [] },
      { name: "昆布", allergens: [] },
      { name: "干し椎茸", allergens: [] },
    ],
    status: "確定",
  },
  {
    id: 6,
    sourceFile: "ingredients_2026_02.csv",
    name: "マヨネーズ",
    rawMaterials: [
      { name: "食用植物油脂（大豆を含む）", allergens: ["大豆"] },
      { name: "卵黄", allergens: ["卵"] },
      { name: "醸造酢", allergens: [] },
      { name: "食塩", allergens: [] },
      { name: "香辛料", allergens: [] },
    ],
    status: "要確認",
  },
  {
    id: 7,
    sourceFile: "dashi_components.xlsx",
    name: "カレールー",
    rawMaterials: [
      { name: "小麦粉", allergens: ["小麦"] },
      { name: "食用油脂（豚脂）", allergens: ["豚肉"] },
      { name: "食塩", allergens: [] },
      { name: "砂糖", allergens: [] },
      { name: "カレー粉", allergens: [] },
      { name: "乳糖", allergens: ["乳"] },
      { name: "脱脂粉乳", allergens: ["乳"] },
    ],
    status: "要確認",
  },
  {
    id: 8,
    sourceFile: "dashi_components.xlsx",
    name: "ごま油",
    rawMaterials: [{ name: "ごま", allergens: ["ごま"] }],
    status: "確定",
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

// ─── Rooms ───

export const ROOMS = [
  "スタイリッシュスイート",
  "エグゼクティブスタイリッシュスイート",
  "コンフォートスイート",
  "エグゼクティブコンフォートスイート",
  "プレシャスコーナースイート",
  "エグゼクティブプレシャスコーナースイート",
  "ラグジュアリーコーナースイート",
  "エグゼクティブラグジュアリーコーナースイート",
  "プレミアムスイート",
  "エグゼクティブプレミアムスイート",
  "ふふラグジュアリープレミアムスイート",
] as const;

// ─── Customers ───

export const customers: Customer[] = [
  {
    id: 1,
    name: "山田 太郎",
    allergens: ["卵", "えび"],
    condition: "微量NG",
    contamination: "不可",
    checkInDate: "2026-02-07",
    roomName: "スタイリッシュスイート",
    notes: "",
    originalText: "",
  },
  {
    id: 2,
    name: "佐藤 花子",
    allergens: ["小麦", "大豆"],
    condition: "少量可",
    contamination: "要確認",
    checkInDate: "2026-02-08",
    roomName: "コンフォートスイート",
    notes: "",
    originalText: "",
  },
  {
    id: 3,
    name: "田中 一郎",
    allergens: ["乳", "落花生", "くるみ"],
    condition: "微量NG",
    contamination: "不可",
    checkInDate: "2026-02-09",
    roomName: "プレミアムスイート",
    notes: "",
    originalText: "",
  },
];

// ─── Courses ───

export const courses: Course[] = [
  {
    id: 1,
    name: "2月特別懐石コース",
    dishIds: [2, 1, 3, 4, 5],
  },
  {
    id: 2,
    name: "お祝い会席コース",
    dishIds: [2, 1, 4, 5],
  },
];
