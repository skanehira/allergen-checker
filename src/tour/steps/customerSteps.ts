import type { Tour } from "../types";

export const customerTour: Tour = {
  name: "customer",
  steps: [
    {
      selector: "#customer-create-btn",
      side: "bottom",
      title: "新規登録",
      content: "お客様のアレルギー情報を新規登録します。",
    },
    {
      selector: "#customer-list-section",
      side: "top",
      title: "顧客一覧",
      content:
        "登録済みのお客様が一覧表示されます。NGアレルゲンや重症度を確認し、編集・削除が行えます。",
      highlightPadding: 4,
    },
  ],
};
