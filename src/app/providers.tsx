"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "@/components/ui/provider"
import ColorModeSwitcherButton from "@/components/ColorModeSwitcherButton";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: false,
        staleTime: Infinity,
      },
    },
  });
  return (
    <Provider>
      <QueryClientProvider client={queryClient}>
        {children}
        <ColorModeSwitcherButton />
      </QueryClientProvider>
    </Provider>
  );
};

export default Providers;