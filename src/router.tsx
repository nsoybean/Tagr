import { Routes, Route, BrowserRouter } from "react-router-dom";
import LandingPage from "./pages/landing/LandingPage";
import App from "./App";
import Login from "./pages/auth/LoginPage";
import Saves from "./pages/saves/SavesPage";
import Archives from "./pages/saves/ArchivesPage";
import NotFoundPage from "./pages/NotFoundPage";
import AccountPage from "./pages/auth/AccountPage";
import Tag from "./pages/tag/TagsPage";
import TagSaves from "./pages/tag/SearchByTagPage";

// import PricingPage from "./pages/pricing/Pricing";
// import App from "./App";
// import Login from "./pages/auth/Login";
// import Saves from "./pages/articles/Saves";
// import NotFoundPage from "./pages/common/NotFound";
// import AccountPage from "./pages/account/Account";
// Router
export const routes = {
  LandingPageRoute: {
    to: "/",
    component: <LandingPage />,
  },
  LoginPageRoute: {
    to: "/login",
    component: <Login />,
  },
  SavesPageRoute: {
    to: "/saves",
    component: <Saves />,
  },
  ArchivePageRoute: {
    to: "/archives",
    component: <Archives />,
  },
  TagPageRoute: {
    to: "/tags",
    component: <Tag />,
  },
  TagSavesPageRoute: {
    to: "/tags/saves",
    component: <TagSaves />,
  },
  //   PricingPageRoute: {
  //     to: "/pricing",
  //     component: <PricingPage />,
  //   },

  ProfilePage: {
    to: "/account",
    component: <AccountPage />,
  },
  NotFoundPage: {
    to: "/*",
    component: <NotFoundPage />,
  },
} as const;

const router = (
  <BrowserRouter basename="/">
    <App>
      <Routes>
        {Object.entries(routes).map(([routeKey, route]) => (
          <Route key={routeKey} path={route.to} element={route.component} />
        ))}
      </Routes>
    </App>
  </BrowserRouter>
);

export default router;
