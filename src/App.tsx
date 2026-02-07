import { useState } from "react";
import type { ReactNode } from "react";
import { Layout } from "./components/Layout";
import { ImportPage } from "./pages/ImportPage";
import { NormalizePage } from "./pages/NormalizePage";
import { RecipeLinkPage } from "./pages/RecipeLinkPage";
import { MatchingPage } from "./pages/MatchingPage";
import { JudgmentPage } from "./pages/JudgmentPage";

const STEPS = [
  { id: 1, label: "仕入れ取込" },
  { id: 2, label: "正規化確認" },
  { id: 3, label: "レシピ紐づけ" },
  { id: 4, label: "突合・可視化" },
  { id: 5, label: "判定確定一覧" },
];

const pages: Record<number, () => ReactNode> = {
  1: () => <ImportPage />,
  2: () => <NormalizePage />,
  3: () => <RecipeLinkPage />,
  4: () => <MatchingPage />,
  5: () => <JudgmentPage />,
};

function App() {
  const [step, setStep] = useState(1);
  const render = pages[step] ?? pages[1];

  return (
    <Layout steps={STEPS} currentStep={step} onStepChange={setStep}>
      {render()}
    </Layout>
  );
}

export default App;
