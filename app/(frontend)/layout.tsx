import { Inter } from "next/font/google";
import MainTemplate from "@/components/frontendcomponents/template/MainTemplate";
import ReduxProvider from "@/store/ReduxProvider";
import { HeaderDataProvider } from "@/context/HeaderDataContext";
import { fetchHeaderDataServer } from "@/lib/server/frontend-data";
import "./global.css";

const inter = Inter({
  variable: "inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  display: "swap",
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headerData = await fetchHeaderDataServer();

  return (
    <html lang="en">
      <body className={`${inter.variable}`} cz-shortcut-listen="true">
        <ReduxProvider>
          <HeaderDataProvider value={headerData}>
            <MainTemplate>{children}</MainTemplate>
          </HeaderDataProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
