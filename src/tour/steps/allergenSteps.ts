import type { Tour } from "../types";

export const allergenTour: Tour = {
  name: "allergen",
  steps: [
    {
      selector: "#allergen-standard-section",
      side: "bottom",
      title: "特定原材料28品目",
      content:
        "日本の法令で定められた28品目です。義務表示8品目と推奨表示20品目が表示されています。",
      highlightPadding: 4,
    },
    {
      selector: "#allergen-custom-section",
      side: "top",
      title: "カスタムアレルゲン",
      content:
        "28品目以外のアレルゲンを独自に追加できます。追加したアレルゲンは顧客登録時の選択肢に反映されます。",
      highlightPadding: 4,
    },
  ],
};
