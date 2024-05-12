import React from "react";
import ReactDOM from "react-dom/client";

import { ThemeProvider } from "./components/ThemeProvider.tsx";
import {
  THEME_PROVIDER_STORAGE_KEY,
  VIEW_ARTICLE_MODE_PROVIDER_STORAGE_KEY,
} from "./configs/env.ts";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  initializeQueryClient,
  queryClientInitialized,
} from "./clients/reactQuery.ts";
import { Toaster } from "react-hot-toast";
import router from "./router.tsx";
import "./App.css";
import { ViewArticleModeProvider } from "./hooks/useArticleViewMode.tsx";

startApp();
async function startApp() {
  initializeQueryClient();

  await render();
}

async function render() {
  const queryClient: any = await queryClientInitialized;

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          defaultTheme="light"
          storageKey={THEME_PROVIDER_STORAGE_KEY}
        >
          <ViewArticleModeProvider
            defaultMode="gallery"
            storageKey={VIEW_ARTICLE_MODE_PROVIDER_STORAGE_KEY}
          >
            <Toaster />
            {router}
          </ViewArticleModeProvider>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </React.StrictMode>,
  );
}
