import type { Tour } from "../types";

export const dashboardTour: Tour = {
  name: "dashboard",
  steps: [
    {
      selector: "#dashboard-create-btn",
      side: "bottom",
      title: "新規割当",
      content: "顧客とコースを選んで新規割当を作成します。ここがチェックの起点です。",
    },
    {
      selector: "#dashboard-filters",
      side: "bottom",
      title: "フィルタ",
      content: "日付やステータスで割当を絞り込めます。",
    },
    {
      selector: "#dashboard-table",
      side: "top",
      title: "割当一覧",
      content: "各行のOK/NG/要確認が一目で分かります。クリックで詳細へ。",
    },
  ],
};
