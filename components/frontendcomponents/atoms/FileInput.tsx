"use client"
import { useState } from "react";

interface FileInputProps {
    name?: string;
    id?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    classname?: string;
    error?: string;
    required?: boolean;
}

export default function FileInput({ name, id, onChange, classname = "", error = "Please Upload File", required = false }: FileInputProps) {
    const [isActive, setIsActive] = useState(false);
    const [isValid, setIsValid] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const fileName = file ? file.name.replace(/C:\\fakepath\\/i, "") : "";
        const valid = !!file;

        const fileNameEl = e.target.parentElement?.querySelector(".file-name") as HTMLElement | null;
        if (fileNameEl) {
            fileNameEl.style.setProperty("--filenameinitial", fileName ? `"${fileName}"` : "var(--filename)");
        }

        setIsValid(valid);
        setIsActive(valid);
        onChange?.(e);
    };

    return (
        <div className={`form-group file-input ${isActive ? "active" : ""} ${classname}`}>
            <input
                type="file"
                name={name}
                id={id}
                required={required}
                className={`form-control ${isValid ? "valid" : ""}`}
                onChange={handleChange}
            />
            <div className="file-name"></div>
            <div className="file_type">Pdf, Docx (max size 2mb)</div>
            <div className="error">{error}</div>
        </div>
    );
}
