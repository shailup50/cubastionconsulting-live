"use client"
import { createContext, useContext, useState } from "react"
import type { ReactNode } from "react"
import type { SideNavSection } from "@/types/composites"

interface SideNavContextValue {
    sections: SideNavSection[];
    setSections: React.Dispatch<React.SetStateAction<SideNavSection[]>>;
}

const SideNavContext = createContext<SideNavContextValue | undefined>(undefined)

interface SideNavProviderProps {
    children: ReactNode;
}

export function SideNavProvider({ children }: SideNavProviderProps) {
    const [sections, setSections] = useState<SideNavSection[]>([])
    return (
        <SideNavContext.Provider value={{ sections, setSections }}>
            {children}
        </SideNavContext.Provider>
    )
}

export const useSideNav = () => useContext(SideNavContext)
