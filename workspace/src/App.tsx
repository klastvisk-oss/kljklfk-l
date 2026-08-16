import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { ReviewedContext, useReviewed } from "./components/fx";
import Home from "./pages/Home";
import PhasePage from "./pages/PhasePage";
import LessonPage from "./pages/LessonPage";

export default function App() {
  const reviewed = useReviewed();
  return (
    <ReviewedContext.Provider value={reviewed}>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/phase/:n" element={<PhasePage />} />
            <Route path="/lesson/:id" element={<LessonPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </HashRouter>
    </ReviewedContext.Provider>
  );
}
