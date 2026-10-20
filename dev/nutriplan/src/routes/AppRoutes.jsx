// ตาราง Routing ของเว็บแอปพลิเคชัน (ตาราง 4.3 ในงานที่ 5) + หน้าเครดิตภาพและแบบสอบถามที่เพิ่มในงานที่ 7
import { Route, Routes } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import AdminMenuFormPage from "../pages/AdminMenuFormPage";
import AdminMenuListPage from "../pages/AdminMenuListPage";
import AdminSurveyPage from "../pages/AdminSurveyPage";
import ArticleDetailPage from "../pages/ArticleDetailPage";
import ArticleListPage from "../pages/ArticleListPage";
import CreditsPage from "../pages/CreditsPage";
import FavoritesPage from "../pages/FavoritesPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import MenuDetailPage from "../pages/MenuDetailPage";
import MenuListPage from "../pages/MenuListPage";
import NotFoundPage from "../pages/NotFoundPage";
import PlannerPage from "../pages/PlannerPage";
import ProfilePage from "../pages/ProfilePage";
import SearchPage from "../pages/SearchPage";
import SurveyPage from "../pages/SurveyPage";
import TodayPage from "../pages/TodayPage";
import WeeklyPage from "../pages/WeeklyPage";
import EditorRoute from "./EditorRoute";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="menus" element={<MenuListPage />} />
        <Route path="menus/:menuId" element={<MenuDetailPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="articles" element={<ArticleListPage />} />
        <Route path="articles/:articleId" element={<ArticleDetailPage />} />
        <Route path="credits" element={<CreditsPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="today" element={<TodayPage />} />
          <Route path="planner" element={<PlannerPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="weekly" element={<WeeklyPage />} />
          <Route path="survey" element={<SurveyPage />} />
        </Route>
        <Route path="admin/menus" element={<EditorRoute />}>
          <Route index element={<AdminMenuListPage />} />
          <Route path="new" element={<AdminMenuFormPage />} />
          <Route path=":menuId/edit" element={<AdminMenuFormPage />} />
        </Route>
        <Route path="admin/survey" element={<EditorRoute />}>
          <Route index element={<AdminSurveyPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
