// component
import Iconify from "../../Components/Iconify";

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: "My Courses",
    path: "/dashboard/user",
    icon: getIcon("eva:people-fill"),
  },
  {
    title: "All Courses",
    path: "/register",
    icon: getIcon("eva:person-add-fill"),
  },
];

export default navConfig;
