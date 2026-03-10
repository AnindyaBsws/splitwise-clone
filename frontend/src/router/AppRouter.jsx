import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Groups from "../pages/Groups";
import GroupDetail from "../pages/GroupDetail";
import ExpenseHistory from "../pages/ExpenseHistory";
import ManageGroup from "../pages/ManageGroup";
import Profile from "../pages/Profile";
import JoinGroup from "../pages/JoinGroup"; // NEW

import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";

function AppRouter() {

  return (
    <BrowserRouter>

      <Routes>

        {/* PUBLIC ROUTES */}

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Invite join route */}
        <Route path="/join/group/:token" element={<JoinGroup />} />

        {/* PROTECTED ROUTES */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/groups"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Groups />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/groups/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <GroupDetail />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/groups/:id/manage"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ManageGroup />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/groups/:id/history"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ExpenseHistory />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );

}

export default AppRouter;