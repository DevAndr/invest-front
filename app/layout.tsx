'use client'

import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import React from "react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const queryClient = new QueryClient()

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <QueryClientProvider client={queryClient}>
            <html lang="ru" className="dark" data-theme="dark">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
            {children}
            </body>
            </html>
        </QueryClientProvider>
    );
}
