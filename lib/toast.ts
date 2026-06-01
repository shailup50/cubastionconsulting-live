import toast from "react-hot-toast";

const baseStyle: React.CSSProperties = {
  minWidth: "120px",
  background: "#8d181b",
  color: "#FFFFFF",
  fontSize: "14px",
  borderRadius: "0px",
  border: "1px solid rgba(255,255,255,0.15)",
  padding: "10px 14px",
};

const successToast = (message: string): void => {
  toast.success(message, {
    duration: 1500,
    style: baseStyle,
  });
};

const errorToast = (message: string): void => {
  toast.error(message, {
    duration: 1500,
    style: baseStyle,
  });
};

const alertToast = (message: string): void => {
  toast(message, {
    duration: 1500,
    style: baseStyle,
  });
};

export { successToast, errorToast, alertToast };
