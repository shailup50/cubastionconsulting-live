"use client"
import { useState, useCallback } from "react"

export default function Textarea({ classname="", label, name, id, onChange, value, placeholder = "", required = false }) {
    const [isActive, setIsActive] = useState(false)
    const [isValid, setIsValid] = useState(false)

    const handleForm = useCallback((e) => {
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
                onInput={handleForm}
                onChange={handleForm}
                onBlur={handleForm}
            />
            <label htmlFor={id}>{label}</label>
        </div>
    )
}