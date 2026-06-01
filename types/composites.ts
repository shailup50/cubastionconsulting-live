import type {
  Service, Industry, Portfolio, Career, Logo, Testimonial,
  Author, Category, ServiceFaq, ServiceCategory, IndustryFaq,
  IndustrySolution, PortfolioHighlight,
} from "./entities";

export interface ServiceWithRelations extends Service {
  faqs: ServiceFaq[];
  categories: Category[];
}

export interface IndustryWithRelations extends Industry {
  faqs: IndustryFaq[];
  solutions: IndustrySolution[];
}

export interface IndustryHeaderItem {
  IndustryID: number;
  IndustryName: string;
  IndustryNameURL: string;
  solutions: IndustrySolution[];
}

export interface PortfolioAuthor {
  AuthorName: string;
  AuthorTaglin: string;
  AuthorImage: string;
}

export interface PortfolioIndustry {
  IndustryName: string;
  IndustryNameURL: string;
}

export interface PortfolioWithRelations extends Portfolio {
  author: PortfolioAuthor | null;
  industry: PortfolioIndustry | null;
}

export interface PortfolioDetail extends PortfolioWithRelations {
  highlights: PortfolioHighlight[];
}

export interface HomeData {
  industries: Pick<Industry, "IndustryName" | "IndustryNameURL" | "IndustryImage" | "IndustryTagLine" | "Description">[];
  logos: Pick<Logo, "LogoName" | "LogoNameURL" | "LogoImage1">[];
  blogs: Pick<Portfolio, "PortfolioName" | "PortfolioNameURL" | "PortfolioImage" | "PortfolioTopHeading">[];
  testimonials: Pick<Testimonial, "TestimonialName" | "TestimonialImage" | "TestimonialLogo" | "TestimonialVideo" | "TestimonialDescription">[];
  awardlogos: Pick<Logo, "LogoName" | "LogoNameURL" | "LogoImage1">[];
}

export interface HeaderData {
  industries: IndustryHeaderItem[];
  service: Pick<Service, "ServiceName">[];
  logos: Pick<Logo, "LogoName" | "LogoNameURL" | "LogoImage1">[];
}

export interface TrustedPartnerDisplay {
  id: number;
  imgSrc: string;
  alt: string;
}

export interface SideNavSection {
  id: string;
  label: string;
}
