<?php

return [

    /*
    |--------------------------------------------------------------------------
    | CubastionWeb - CORS Configuration
    |--------------------------------------------------------------------------
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', '*'],

    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    'allowed_origins' => [
        // Production
        'https://cubastion.cyralix.com',
        'https://www.cubastion.cyralix.com',
        'http://cubastionconsulting.com',
        'https://cubastionconsulting.com',
        'https://www.cubastionconsulting.com',

        // Local Development
        'http://localhost',
        'http://localhost:3000',    // Next.js default
        'http://localhost:3001',    // Next.js alternate
        'http://localhost:8000',    // Laravel self
        'http://127.0.0.1:3000',
        'http://127.0.0.1:8000',
        'http://148.72.245.39:3000',
    ],

    'allowed_origins_patterns' => [
        '#^https://.*\.cyralix\.com$#',   // All cyralix subdomains
    ],

    'allowed_headers' => [
        'Content-Type',
        'Accept',
        'Authorization',
        'X-Requested-With',
        'X-CSRF-TOKEN',
        'X-XSRF-TOKEN',
        'Origin',
    ],

    'exposed_headers' => [
        'Authorization',
    ],

    'max_age' => 86400, // Cache preflight for 24 hours (performance boost)

    'supports_credentials' => true,

];