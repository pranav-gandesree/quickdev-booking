import DeveloperDashboard from "@/components/canvas/DeveloperDashboard";
import UserDashboard from "@/components/canvas/UserDashboard";
import { useSession } from "next-auth/react";

export const DashboardPage = () => {
  const { data: session } = useSession();
  
  // if (session?.user.role === "DEVELOPER") {
  if (true) {
    return <DeveloperDashboard/>;
  } else {
    return <UserDashboard/>;
  }
};
