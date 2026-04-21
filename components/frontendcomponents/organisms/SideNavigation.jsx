"use client"
import { useSideNav } from "@/context/SideNavContext"
import { useState, useEffect } from "react"

export default function SideNavigation(){
    const { sections } = useSideNav()
    const [activeId, setActiveId] = useState(sections[0]?.id || "")
    useEffect(() => {
        const observers = []
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id)
                    }
                })
            },
            { rootMargin: "-50px 0px 0px 0px", threshold: 0.5 } // 50% of section visible = active
        )
        
        sections.forEach(({ id }) => {
            const el = document.getElementById(id)
            if (el) observer.observe(el)
            })
        
        return () => observer.disconnect()
    }, [sections])
    
    const handleClick = (id) => {
        const el = document.getElementById(id)
        if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 50
            window.scrollTo({ top, behavior: "smooth" })
        }
    }
    
    if (!sections || sections.length === 0) return null
    return (
        <nav className="side-nav">
            <ul>
                {sections.map((section, index) => (
                    <li
                        key={section.id}
                        className={activeId === section.id ? "active" : ""}
                        onClick={() => handleClick(section.id)}
                    >
                        <span className="number">{String(index + 1).padStart(2, "0")}</span>
                        <span className="label">{section.label}</span>
                    </li>
                ))}
            </ul>
        </nav>
    )
}