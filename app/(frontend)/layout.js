import { Inter } from "next/font/google";
import MainTemplate from "@/components/frontendcomponents/template/MainTemplate";
import ReduxProvider from "@/store/ReduxProvider";
import "./global.css";

const inter = Inter({
  variable: "inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable}`} cz-shortcut-listen="true">
        <ReduxProvider>
          <MainTemplate>{children}</MainTemplate>
        </ReduxProvider>
      </body>
    </html>
  );
}
