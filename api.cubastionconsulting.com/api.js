// lib/api.js
// CubastionWeb - Next.js API Service
// Base URL reads from .env.local: NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

async function apiFetch(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('cweb_token') : null;

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'API Error');
  }
  return data;
}

// ─── AUTH ──────────────────────────────────────────────────────────────────
export const AuthAPI = {
  login:  (body) => apiFetch('/auth/login',  { method: 'POST', body: JSON.stringify(body) }),
  logout: ()     => apiFetch('/auth/logout', { method: 'POST' }),
};

// ─── AUTHORS ───────────────────────────────────────────────────────────────
export const AuthorAPI = {
  getAll:    ()       => apiFetch('/authors'),
  getById:   (id)     => apiFetch(`/authors/${id}`),
  create:    (body)   => apiFetch('/authors',     { method: 'POST',   body: JSON.stringify(body) }),
  update:    (id, body)=> apiFetch(`/authors/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete:    (id)     => apiFetch(`/authors/${id}`,  { method: 'DELETE' }),
};

// ─── CATEGORIES ────────────────────────────────────────────────────────────
export const CategoryAPI = {
  getAll:    ()       => apiFetch('/categories'),
  getById:   (id)     => apiFetch(`/categories/${id}`),
  create:    (body)   => apiFetch('/categories',     { method: 'POST',   body: JSON.stringify(body) }),
  update:    (id, body)=> apiFetch(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete:    (id)     => apiFetch(`/categories/${id}`,  { method: 'DELETE' }),
};

// ─── INDUSTRIES ────────────────────────────────────────────────────────────
export const IndustryAPI = {
  getAll:     ()      => apiFetch('/industries'),
  getHome:    ()      => apiFetch('/industries/home'),
  getById:    (id)    => apiFetch(`/industries/${id}`),
  getByURL:   (url)   => apiFetch(`/industries/url/${url}`),
  create:     (body)  => apiFetch('/industries',     { method: 'POST',   body: JSON.stringify(body) }),
  update:     (id, body)=> apiFetch(`/industries/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete:     (id)    => apiFetch(`/industries/${id}`,   { method: 'DELETE' }),
};

// ─── INDUSTRY FAQS ─────────────────────────────────────────────────────────
export const IndustryFaqAPI = {
  getAll:          ()           => apiFetch('/industry-faqs'),
  getById:         (id)         => apiFetch(`/industry-faqs/${id}`),
  getByIndustry:   (industryId) => apiFetch(`/industry-faqs/by-industry/${industryId}`),
  create:          (body)       => apiFetch('/industry-faqs',     { method: 'POST',   body: JSON.stringify(body) }),
  update:          (id, body)   => apiFetch(`/industry-faqs/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete:          (id)         => apiFetch(`/industry-faqs/${id}`, { method: 'DELETE' }),
};

// ─── INDUSTRY SOLUTIONS ────────────────────────────────────────────────────
export const IndustrySolutionAPI = {
  getAll:        ()           => apiFetch('/industry-solutions'),
  getById:       (id)         => apiFetch(`/industry-solutions/${id}`),
  getByIndustry: (industryId) => apiFetch(`/industry-solutions/by-industry/${industryId}`),
  create:        (body)       => apiFetch('/industry-solutions',     { method: 'POST',   body: JSON.stringify(body) }),
  update:        (id, body)   => apiFetch(`/industry-solutions/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete:        (id)         => apiFetch(`/industry-solutions/${id}`, { method: 'DELETE' }),
};

// ─── LOGOS ─────────────────────────────────────────────────────────────────
export const LogoAPI = {
  getAll:        ()           => apiFetch('/logos'),
  getHome:       ()           => apiFetch('/logos/home'),
  getById:       (id)         => apiFetch(`/logos/${id}`),
  getByURL:      (url)        => apiFetch(`/logos/url/${url}`),
  getByType:     (type)       => apiFetch(`/logos/type/${type}`),
  getByIndustry: (industryId) => apiFetch(`/logos/by-industry/${industryId}`),
  create:        (body)       => apiFetch('/logos',     { method: 'POST',   body: JSON.stringify(body) }),
  update:        (id, body)   => apiFetch(`/logos/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete:        (id)         => apiFetch(`/logos/${id}`, { method: 'DELETE' }),
};

// ─── STATIC PAGES ──────────────────────────────────────────────────────────
export const PageAPI = {
  getAll:    ()      => apiFetch('/pages'),
  getById:   (id)    => apiFetch(`/pages/${id}`),
  getByURL:  (url)   => apiFetch(`/pages/url/${url}`),
  create:    (body)  => apiFetch('/pages',     { method: 'POST',   body: JSON.stringify(body) }),
  update:    (id, body)=> apiFetch(`/pages/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete:    (id)    => apiFetch(`/pages/${id}`,   { method: 'DELETE' }),
};

// ─── PORTFOLIOS ────────────────────────────────────────────────────────────
export const PortfolioAPI = {
  getAll:        ()           => apiFetch('/portfolios'),
  getHome:       ()           => apiFetch('/portfolios/home'),
  getById:       (id)         => apiFetch(`/portfolios/${id}`),
  getByURL:      (url)        => apiFetch(`/portfolios/url/${url}`),
  getByType:     (type)       => apiFetch(`/portfolios/type/${type}`),
  getByIndustry: (industryId) => apiFetch(`/portfolios/by-industry/${industryId}`),
  create:        (body)       => apiFetch('/portfolios',     { method: 'POST',   body: JSON.stringify(body) }),
  update:        (id, body)   => apiFetch(`/portfolios/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete:        (id)         => apiFetch(`/portfolios/${id}`, { method: 'DELETE' }),
};

// ─── PORTFOLIO HIGHLIGHTS ──────────────────────────────────────────────────
export const PortfolioHighlightAPI = {
  getAll:         ()            => apiFetch('/portfolio-highlights'),
  getById:        (id)          => apiFetch(`/portfolio-highlights/${id}`),
  getByPortfolio: (portfolioId) => apiFetch(`/portfolio-highlights/by-portfolio/${portfolioId}`),
  create:         (body)        => apiFetch('/portfolio-highlights',     { method: 'POST',   body: JSON.stringify(body) }),
  update:         (id, body)    => apiFetch(`/portfolio-highlights/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete:         (id)          => apiFetch(`/portfolio-highlights/${id}`, { method: 'DELETE' }),
};

// ─── SERVICES ──────────────────────────────────────────────────────────────
export const ServiceAPI = {
  getAll:    ()      => apiFetch('/services'),
  getById:   (id)    => apiFetch(`/services/${id}`),
  getByURL:  (url)   => apiFetch(`/services/url/${url}`),
  create:    (body)  => apiFetch('/services',     { method: 'POST',   body: JSON.stringify(body) }),
  update:    (id, body)=> apiFetch(`/services/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete:    (id)    => apiFetch(`/services/${id}`,   { method: 'DELETE' }),
};

// ─── SERVICE FAQS ──────────────────────────────────────────────────────────
export const ServiceFaqAPI = {
  getAll:       ()          => apiFetch('/service-faqs'),
  getById:      (id)        => apiFetch(`/service-faqs/${id}`),
  getByService: (serviceId) => apiFetch(`/service-faqs/by-service/${serviceId}`),
  create:       (body)      => apiFetch('/service-faqs',     { method: 'POST',   body: JSON.stringify(body) }),
  update:       (id, body)  => apiFetch(`/service-faqs/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete:       (id)        => apiFetch(`/service-faqs/${id}`, { method: 'DELETE' }),
};

// ─── TESTIMONIALS ──────────────────────────────────────────────────────────
export const TestimonialAPI = {
  getAll:    ()      => apiFetch('/testimonials'),
  getById:   (id)    => apiFetch(`/testimonials/${id}`),
  create:    (body)  => apiFetch('/testimonials',     { method: 'POST',   body: JSON.stringify(body) }),
  update:    (id, body)=> apiFetch(`/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete:    (id)    => apiFetch(`/testimonials/${id}`,   { method: 'DELETE' }),
};

// ─── CONTACT US ────────────────────────────────────────────────────────────
export const ContactAPI = {
  submit:    (body) => apiFetch('/contact-us',      { method: 'POST', body: JSON.stringify(body) }),
  getAll:    ()     => apiFetch('/contact-us'),
  getById:   (id)   => apiFetch(`/contact-us/${id}`),
  delete:    (id)   => apiFetch(`/contact-us/${id}`, { method: 'DELETE' }),
};