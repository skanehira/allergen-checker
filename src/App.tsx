import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ImportPage } from "./pages/ImportPage";
import { RecipeLinkPage } from "./pages/RecipeLinkPage";
import { CoursePage } from "./pages/CoursePage";
import { CustomAllergenPage } from "./pages/CustomAllergenPage";
import { CustomerListPage, CustomerFormPage } from "./pages/CustomerPage";
import { DashboardPage } from "./pages/DashboardPage";
import { AssignmentDetailPage } from "./pages/AssignmentDetailPage";
import { CustomizePage } from "./pages/CustomizePage";
import { KitchenPage } from "./pages/KitchenPage";

export const STEPS = [
  { id: 1, label: "仕入れ取込", path: "/import" },
  { id: 2, label: "料理登録", path: "/recipe" },
  { id: 3, label: "コース登録", path: "/course" },
];

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout steps={STEPS} />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/:assignmentId" element={<AssignmentDetailPage />} />
          <Route path="/dashboard/:assignmentId/customize" element={<CustomizePage />} />
          <Route path="/kitchen" element={<KitchenPage />} />
          <Route path="/import" element={<ImportPage />} />
          <Route path="/recipe" element={<RecipeLinkPage />} />
          <Route path="/course" element={<CoursePage />} />
          <Route path="/allergens" element={<CustomAllergenPage />} />
          <Route path="/customers" element={<CustomerListPage />} />
          <Route path="/customers/new" element={<CustomerFormPage />} />
          <Route path="/customers/edit/:id" element={<CustomerFormPage />} />
          <Route path="/normalize" element={<Navigate to="/import" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
