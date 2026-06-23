import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { DatabaseProvider } from "@/components/database-context";

import "./globals.css";

const inter = Geist({

    subsets: ["latin"]

});

export const metadata: Metadata = {

    title: "NETBATCH HELPER",

    description: "HP NonStop Explorer & Obey Generator"

};

export default function RootLayout({

    children,

}: Readonly<{

    children: React.ReactNode;

}>) {

    return (

        <html lang="fr">

            <body className={`${inter.className} bg-[#09090b] text-white antialiased`}>

                <DatabaseProvider>
                    {children}
                </DatabaseProvider>

            </body>

        </html>

    );

}