import type { Tour } from "../types";

export const welcomeTour: Tour = {
  name: "welcome",
  steps: [
    {
      selector: null,
      side: "bottom",
      title: "ようこそ!",
      content: "アレルゲンチェッカーへようこそ! 基本的な使い方をご案内します。",
    },
    {
      selector: "#sidebar-steps",
      side: "right",
      title: "基礎データの準備",
      content: "3つのステップで基礎データを準備します: 仕入れ取込 → 料理登録 → コース登録",
    },
    {
      selector: "#sidebar-dashboard",
      side: "right",
      title: "ダッシュボード",
      content: "データ準備後、ここで顧客ごとのアレルギーチェックを行います。",
    },
    {
      selector: "#sidebar-kitchen",
      side: "right",
      title: "厨房連携",
      content: "確認完了後、厨房連携シートを印刷できます。",
    },
    {
      selector: "#sidebar-customers",
      side: "right",
      title: "顧客管理",
      content: "お客様のアレルギー情報はここで管理します。",
    },
    {
      selector: "#tour-help-btn",
      side: "bottom",
      title: "ヘルプボタン",
      content: "各画面でこのボタンを押すと、いつでもガイドを確認できます。",
    },
  ],
};
