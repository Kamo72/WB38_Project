import { lazy, Suspense, useEffect } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const MainPage = lazy(() => import('src/pages/main'));
export const DashboardPage = lazy(() => import('src/pages/dashboard'));
export const HistoryPage = lazy(() => import('src/pages/history'));
export const ChartPage = lazy(() => import('src/pages/chart'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ReferencePage = lazy(() => import('src/pages/reference'));
export const Page404 = lazy(() => import('src/pages/error'));
export const SignUpPage = lazy(() => import('src/pages/signup'));
export const UserPage = lazy(() => import('src/pages/user')); // 새로 추가한 유저 페이지
export const ChatPage = lazy(() => import('src/pages/chat')); // 새로 추가한 채팅 페이지

export default function Router() {
  const routes = useRoutes([
    {
      path: '/',
      element: sessionStorage.getItem('user') ? <Navigate to="/dashboard" replace /> : <MainPage />,
      // element: <Navigate to="/dashboard" replace />,
      index: true,
    },
    // 대시보드 레이아웃을 가진 경로들
    {
      path: '/',
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { path: 'dashboard', element: <DashboardPage /> },
        { path: 'history', element: <HistoryPage /> },
        { path: 'chart', element: <ChartPage /> },
        { path: 'reference', element: <ReferencePage /> },
        { path: 'chat', element: <ChatPage /> },
      ],
    },
    {
      path: 'login',
      element: sessionStorage.getItem('user') ? <Navigate to="/dashboard" replace /> : <LoginPage />,
    },
    {
      path: 'signup',
      element: sessionStorage.getItem('user') ? <Navigate to="/dashboard" replace /> : <SignUpPage />,
    },
    {
      path: 'user',
      element: <UserPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    // 정의되지 않은 모든 경로는 '/404'로 리다이렉트
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
