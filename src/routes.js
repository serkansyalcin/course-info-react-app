import { Navigate, useRoutes } from "react-router-dom";
// layouts
import DashboardLayout from "./layouts/dashboard";
import LogoOnlyLayout from "./layouts/LogoOnlyLayout";
import MyCourse from "./pages/MyCourse";
import NotFound from "./pages/Page404";
import CourseDetails from "./pages/CourseDetails";
import AllCourses from "./pages/AllCourses";

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: "/dashboard",
      element: <DashboardLayout />,
      children: [
        { path: "my-course", element: <MyCourse /> },
        { path: "all-course", element: <AllCourses /> },
      ],
    },
    {
      path: "/dashboard/my-course/:id",
      element: <CourseDetails />,
    },
    {
      path: "/",
      element: <LogoOnlyLayout />,
      children: [
        { path: "/", element: <Navigate to="/dashboard/my-course" /> },
        { path: "404", element: <NotFound /> },
        { path: "*", element: <Navigate to="/404" /> },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ]);
}
