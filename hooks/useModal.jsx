"use client";
import { useDispatch } from "react-redux";
import { setIsModal, setModalData } from "../store/slices/modalSlice";

export const useModal = () => {
  const dispatch = useDispatch();

  const openModal = (type, data = null) => {
    dispatch(setIsModal(type));
    dispatch(setModalData(data));
    document.body.classList.add("no-scroll");
  };

  const closeModal = () => {
    dispatch(setIsModal(null));
    document.body.classList.remove("no-scroll");
  };

  return { openModal, closeModal };
};
