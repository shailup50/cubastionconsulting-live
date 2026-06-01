"use client";
import { useEffect, useState } from "react";

const Loading = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        zIndex: 100,
      }}
    >
      <span
        style={{
          display: "block",
          height: "39px",
          width: "39px",
          borderRadius: "50%",
          border: "2px solid teal",
          borderBottomWidth: "3px",
          borderBottomColor: "orange",
          animation: "spin 1s linear infinite",
        }}
      ></span>
    </div>
  );
};

export default Loading;
