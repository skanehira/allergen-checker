import type { Tour } from "../types";

export const kitchenTour: Tour = {
  name: "kitchen",
  steps: [
    {
      selector: "#kitchen-print-btn",
      side: "bottom",
      title: "印刷",
      content: "厨房連携シートをブラウザの印刷機能で出力できます。",
    },
    {
      selector: "#kitchen-sheets",
      side: "top",
      title: "連携シート",
      content:
        "ステータスが「厨房共有済」の割当が表示されます。顧客のアレルゲン情報と料理の対応内容を一覧で確認できます。",
      highlightPadding: 4,
    },
  ],
};
