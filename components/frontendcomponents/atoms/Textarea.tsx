"use client"
import { useState, useCallback } from "react"

interface TextareaProps {
    classname?: string;
    label?: string;
    name?: string;
    id?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement> | React.FocusEvent<HTMLTextAreaElement>) => void;
    value?: string;
    placeholder?: string;
    required?: boolean;
}

export default function Textarea({ classname="", label, name, id, onChange, value, placeholder = "", required = false }: TextareaProps) {
    const [isActive, setIsActive] = useState(false)
    const [isValid, setIsValid] = useState(false)

    const handleForm = useCallback((e: React.ChangeEvent<HTMLTextAreaElement> | React.FocusEvent<HTMLTextAreaElement>) => {
        const val = e.target.value
        const valid = val !== ""
        setIsValid(valid)
        setIsActive(valid)
        if (onChange) onChange(e)
    }, [onChange])

    return (
        <div className={`form-group ${isActive ? "active" : ""} ${classname}`}>
            <textarea
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
