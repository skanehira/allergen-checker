import type { Tour } from "../types";

export const courseTour: Tour = {
  name: "course",
  steps: [
    {
      selector: "#course-list-section",
      side: "bottom",
      title: "コース一覧",
      content: "コース一覧です。クリックしてレシピを紐づけます。",
    },
    {
      selector: "#course-create-btn",
      side: "bottom",
      title: "新規作成",
      content: "ここから新しいコースを登録できます。",
    },
  ],
};
