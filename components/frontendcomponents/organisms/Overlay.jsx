'use client';
import { useEffect } from 'react';
import { useModalStore } from '@/zustand/modalStore';

export default function Overlay() {
    const isHamOpen = useModalStore((state) => state.isHamOpen);
    const isEnquireOpen = useModalStore((state) => state.isEnquireOpen);
    const isVideoOpen = useModalStore((state) => state.isVideoOpen)
    const isThankyouOpen = useModalStore((state) => state.isThankyouOpen)
    const isRegionPopOpen = useModalStore((state) => state.isRegionPopOpen)
    const isJobFormOpen = useModalStore((state) => state.isJobFormOpen)
    const isTeamPopOpen = useModalStore((state) => state.isTeamPopOpen)
    const closeAll = useModalStore((state) => state.closeAll);

    const isAnyOpen = isHamOpen || isEnquireOpen || isVideoOpen || isThankyouOpen || isRegionPopOpen || isJobFormOpen || isTeamPopOpen
    useEffect(() => {
        if (isAnyOpen) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }

        return () => document.body.classList.remove('overflow-hidden');
    }, [isAnyOpen]);

    return (
        <div
            className={`overlay ${isAnyOpen ? 'is-open' : ''}`}
            onClick={closeAll}
        />
    );
}