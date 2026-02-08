import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ImportPage } from "./pages/ImportPage";
import { RecipeLinkPage } from "./pages/RecipeLinkPage";
import { CoursePage } from "./pages/CoursePage";
import { AllergenCheckPage } from "./pages/AllergenCheckPage";
import { CustomAllergenPage } from "./pages/CustomAllergenPage";

export const STEPS = [
  { id: 1, label: "仕入れ取込", path: "/import" },
  { id: 2, label: "レシピ作成", path: "/recipe" },
  { id: 3, label: "コース作成", path: "/course" },
  { id: 4, label: "アレルゲンチェック", path: "/check" },
];

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout steps={STEPS} />}>
          <Route path="/import" element={<ImportPage />} />
          <Route path="/recipe" element={<RecipeLinkPage />} />
          <Route path="/course" element={<CoursePage />} />
          <Route path="/check" element={<AllergenCheckPage />} />
          <Route path="/allergens" element={<CustomAllergenPage />} />
          <Route path="/normalize" element={<Navigate to="/import" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/import" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
