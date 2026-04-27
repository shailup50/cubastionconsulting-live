import React from 'react'
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = "Basic " + btoa(`${username}:${password}`);
const CANONICAL_BASE = process.env.NEXT_PUBLIC_CANONICAL_URL ?? "https://localhost:7093";

import { SiebelServices } from '@/components/frontendcomponents/pages/siebel-services'


function page() {
    return (
        <>

            <SiebelServices />

        </>
    )
}

export default page