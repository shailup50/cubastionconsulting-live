"use client"
import { useState, useCallback } from "react"

interface InputProps {
    classname?: string;
    label?: string;
    type?: string;
    name?: string;
    id?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => void;
    value?: string;
    placeholder?: string;
    required?: boolean;
}

export default function Input({ classname="", label, type = "text", name, id, onChange, value, placeholder = "", required = false }: InputProps) {
    const [isActive, setIsActive] = useState(false)
    const [isValid, setIsValid] = useState(false)

    const handleForm = useCallback((e: React.ChangeEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => {
        const val = e.target.value
        const valid = val !== ""
        setIsValid(valid)
        setIsActive(valid)
        if (onChange) onChange(e)
    }, [onChange])

    return (
        <div className={`form-group ${isActive ? "active" : ""} ${classname}`}>
            <input
                type={type}
                name={name}
                id={id}
                value={value}
                placeholder={placeholder}
                required={required}
                className={`form-control ${isValid ? "valid" : ""}`}
                onFocus={handleForm}
                onInput={handleForm as any}
                onChange={handleForm}
                onBlur={handleForm}
            />
            <label htmlFor={id}>{label}</label>
        </div>
    )
}
