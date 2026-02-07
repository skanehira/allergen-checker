import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ImportPage } from "./pages/ImportPage";
import { NormalizePage } from "./pages/NormalizePage";
import { RecipeLinkPage } from "./pages/RecipeLinkPage";
import { JudgmentPage } from "./pages/JudgmentPage";

export const STEPS = [
  { id: 1, label: "仕入れ取込", path: "/import" },
  { id: 2, label: "正規化確認", path: "/normalize" },
  { id: 3, label: "レシピ紐づけ", path: "/recipe" },
  { id: 4, label: "判定確定一覧", path: "/judgment" },
];

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout steps={STEPS} />}>
          <Route path="/import" element={<ImportPage />} />
          <Route path="/normalize" element={<NormalizePage />} />
          <Route path="/recipe" element={<RecipeLinkPage />} />
          <Route path="/judgment" element={<JudgmentPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/import" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
