'use client';

import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { LocalCronRunner } from "../LocalCronRunner";
import NextTopLoader from "nextjs-toploader";

export function AppProviders({ children }: { children: React.ReactNode }) {
    const [isClient, setIsClient] = useState(false);
    const [queryClient, setQueryClient] = useState<QueryClient | null>(null);

    useEffect(() => {
        setIsClient(true); // Ensures that the client-only logic runs after the initial render
        setQueryClient(new QueryClient());
    }, []);

    if (!isClient || !queryClient) {
        return <div className="w-full h-screen flex items-center justify-center"><Loader2Icon className="animate-spin stroke-primary" size={54} /></div>; // Optionally show a loading indicator until the client-side has initialized
    }

    return (
        <QueryClientProvider client={queryClient}>
                  <NextTopLoader color="#10b981" showSpinner={false} />
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                {children}
            </ThemeProvider>
                  <LocalCronRunner />
            {/* {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />} */}
        </QueryClientProvider>
    );
}
