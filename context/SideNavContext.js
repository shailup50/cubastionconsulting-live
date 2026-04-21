"use client"
import { createContext, useContext, useState } from "react"

const SideNavContext = createContext()

export function SideNavProvider({ children }) {
    const [sections, setSections] = useState([])
    return (
        <SideNavContext.Provider value={{ sections, setSections }}>
            {children}
        </SideNavContext.Provider>
    )
}

export const useSideNav = () => useContext(SideNavContext)