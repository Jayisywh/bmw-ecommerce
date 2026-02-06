import { Outlet } from "react-router-dom";
import { AppWrapper } from "../../components/client/AppWrapper";

export default function ClientLayout() {
  return (
    <AppWrapper>
      <Outlet />
    </AppWrapper>
  );
}
