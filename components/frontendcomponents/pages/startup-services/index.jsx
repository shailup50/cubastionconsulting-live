"use client";
import React, { useEffect } from "react";
import { useSideNav } from "@/context/SideNavContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomeData } from "@/store/frontendSlice/homeSlice";
import { HeroBanner } from "./HeroBanner";
import staticData from "@/uploads/data/StaticData.json";


export const StartupServices = () => {
    const dispatch = useDispatch();
    const { homeData } = useSelector((state) => state.home);
    const { setSections } = useSideNav();

    const getHomeData = async () => {
        try {
            await dispatch(fetchHomeData()).unwrap();
        } catch (error) {
        }
    };

    useEffect(() => {
        getHomeData();
    }, []);

    useEffect(() => {
        setSections([
            { id: "heroSection", label: "Startup Services" },
        ]);

        return () => setSections([]);
    }, [setSections]);

    const heroSectionData = staticData.StartupServices.Section1;

    return (
        <>

            <HeroBanner id="heroSection" data={heroSectionData} />
          

        </>
    )
}
