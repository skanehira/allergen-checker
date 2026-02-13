import type { Tour } from "../types";

export const recipeTour: Tour = {
  name: "recipe",
  steps: [
    {
      selector: "#recipe-list-section",
      side: "bottom",
      title: "レシピ一覧",
      content: "登録済みレシピの一覧です。クリックして食材を紐づけます。",
    },
    {
      selector: "#recipe-create-btn",
      side: "bottom",
      title: "新規作成",
      content: "ここから新しい料理を登録できます。",
    },
  ],
};
