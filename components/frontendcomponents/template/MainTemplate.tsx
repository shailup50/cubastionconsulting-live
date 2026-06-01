import Footer from "../organisms/Footer";
import Header from "../organisms/Header";
import { SideNavProvider } from "@/context/SideNavContext";
import SideNavigation from "../organisms/SideNavigation";

export default function MainTemplate({ children }: { children: React.ReactNode }) {
    return(
        <SideNavProvider>
            <Header />
            <SideNavigation />
            {children}
            <Footer />
        </SideNavProvider>
    )
}
