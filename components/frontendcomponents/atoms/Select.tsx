"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    classname?: string;
    label?: string;
    name?: string;
    id?: string;
    onChange?: (e: any) => void;
    value?: string;
    required?: boolean;
    options?: SelectOption[];
}

export default function Select({ classname = "", label, name, id, onChange, value, required = false, options = [] }: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<SelectOption | null>(null);
    const [isActive, setIsActive] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = useCallback((opt: SelectOption) => {
        const valid = opt.value !== "" && opt.value !== "0";
        setSelected(opt);
        setIsValid(valid);
        setIsActive(valid);
        setIsOpen(false);
        onChange?.({ target: { name, value: opt.value } });
    }, [name, onChange]);

    return (
        <div className={`form-group ${isActive ? "active" : ""} ${classname}`} ref={wrapperRef}>
            {/* Hidden native select */}
            <select
                name={name}
                id={id}
                value={selected?.value || "0"}
                required={required}
                onChange={() => { }}
                className={`${isValid ? "valid" : ""}`}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>

            {/* Custom select UI */}
            <div
                className={`custom-select form-control ${isValid ? "valid" : ""} ${isOpen ? "open" : ""}`}
                tabIndex={0}
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <span className="current">{selected ? selected.label : label}</span>
                <ul className="list">
                    <li
                        data-value="0"
                        className={`option ${!selected ? "selected focus" : ""}`}
                        onClick={(e) => { e.stopPropagation(); handleSelect({ value: "0", label: label || "" }) }}
                    >
                        {label}
                    </li>
                    {options.map((opt) => (
                        <li
                            key={opt.value}
                            data-value={opt.value}
                            className={`option ${selected?.value === opt.value ? "selected focus" : ""}`}
                            onClick={(e) => { e.stopPropagation(); handleSelect(opt) }}
                        >
                            {opt.label}
                        </li>
                    ))}
                </ul>
            </div>

            <label htmlFor={id}>{label}</label>
        </div>
    );
}
