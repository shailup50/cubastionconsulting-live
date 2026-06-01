export interface Service {
  ServiceID: number;
  ServiceName: string;
  ServiceNameURL: string;
  ServiceImage: string;
  ServiceBannerImage?: string;
  ServiceBannerImage1?: string;
  ServiceTagLine?: string;
  ServicePunchline?: string;
  DescriptionHeading?: string;
  Description?: string;
  OtherDescriptionHeading?: string;
  OtherDescription?: string;
  DisplayOrder: number;
  ActiveStatus: number;
  MetaTitle?: string;
  MetaKeywords?: string;
  MetaDescriptions?: string;
  MetaSchema?: string;
  MetaOgImage?: string;
  PostedDate?: string;
  UpdatedBy?: string;
  UpdatedOn?: string;
}

export interface Industry {
  IndustryID: number;
  IndustryName: string;
  IndustryNameURL: string;
  IndustryImage: string;
  IndustryBannerImage?: string;
  IndustryTagLine?: string;
  Description?: string;
  DisplayOrder: number;
  DisplayOnHome: number;
  ActiveStatus: number;
  MetaTitle?: string;
  MetaKeywords?: string;
  MetaDescriptions?: string;
  MetaSchema?: string;
  MetaOgImage?: string;
  PostedDate?: string;
  UpdatedBy?: string;
  UpdatedOn?: string;
}

export interface Portfolio {
  PortfolioID: number;
  AuthorID: number;
  IndustryID: number;
  PortfolioName: string;
  PortfolioNameURL: string;
  PortfolioTopHeading: string;
  PortfolioImage: string;
  PortfolioBannerImage: string;
  PortfolioType?: string;
  PortfolioDescription?: string;
  OtherDescription?: string;
  DisplayOrder: number;
  DisplayOnHome: number;
  ActiveStatus: number;
  MetaTitle?: string;
  MetaKeywords?: string;
  MetaDescriptions?: string;
  MetaSchema?: string;
  MetaOgImage?: string;
  PostedDate?: string;
  UpdatedBy?: string;
  UpdatedOn?: string;
}

export interface Career {
  CareerID: number;
  JobCategoryName: string;
  CareerName: string;
  CareerNameURL: string;
  CareerPosition: string;
  CareerLocation?: string;
  CareerImage?: string;
  CareerBannerImage?: string;
  Description?: string;
  DisplayOrder: number;
  ActiveStatus: number;
  MetaTitle?: string;
  MetaKeywords?: string;
  MetaDescriptions?: string;
  MetaSchema?: string;
  PostedDate?: string;
  UpdatedBy?: string;
  UpdatedOn?: string;
}

export interface Logo {
  LogoID: number;
  LogoName: string;
  LogoNameURL: string;
  LogoImage1: string;
  DisplayOrder: number;
  ActiveStatus: number;
}

export interface Testimonial {
  TestimonialID: number;
  TestimonialName: string;
  TestimonialDescription?: string;
  TestimonialImage?: string;
  TestimonialLogo?: string;
  TestimonialVideo?: string;
  DisplayOrder: number;
  ActiveStatus: number;
  PostedDate?: string;
}

export interface Team {
  TeamID: number;
  TeamName: string;
  TeamDesignation: string;
  TeamBio: string;
  TeamImage?: string;
  TeamType?: string;
  TeamLinkedInLink?: string;
  ActiveStatus: number;
  DisplayOrder: number;
  PostedDate?: string;
  UpdatedBy?: string;
}

export interface Milestone {
  MilestoneID: number;
  Title: string;
  Description?: string;
  MilestoneYear?: string;
  ActiveStatus: number;
  DisplayOrder: number;
  PostedDate?: string;
  UpdatedBy?: string;
}

export interface Author {
  AuthorID: number;
  AuthorName: string;
  AuthorTaglin: string;
  AuthorImage: string;
  DisplayOrder: number;
  ActiveStatus: number;
  PostedDate?: string;
}

export interface Category {
  CategoryID: number;
  CategoryType: string;
  CategoryName: string;
  DisplayOrder: number;
  ActiveStatus: number;
  PostedDate?: string;
}

export interface Page {
  StaticPageID: number;
  StaticPageName: string;
  StaticPageNameURL?: string;
  StaticPageImage?: string;
  SmallDescription?: string;
  Description?: string;
  ActiveStatus: number;
  MetaTitle?: string;
  MetaKeywords?: string;
  MetaDescriptions?: string;
  MetaSchema?: string;
}

export interface User {
  loginID: number;
  UserName: string;
  UserFullName?: string;
  Passwords?: string;
  ActiveStatus: number;
  LastLoginDate?: string;
}

export interface ContactUs {
  ContactID: number;
  FullName: string;
  EmailID: string;
  PhoneNo?: string;
  NoOfGuest?: string;
  Message?: string;
  EnquiryType?: string;
  EnquiryFor?: string;
  PageName?: string;
  PostedDate?: string;
}

export interface ContactSiebelExpert {
  id: number;
  first_name: string;
  last_name?: string | null;
  email: string;
  company?: string | null;
  service?: string | null;
  version?: string | null;
  created_at?: string;
}

export interface ContactTechCoFounder {
  id: number;
  name: string;
  email: string;
  idea_description: string;
}

export interface ServiceFaq {
  ServiceFaqID: number;
  ServiceID: number;
  Question: string;
  Answer: string;
  DisplayOrder: number;
  ActiveStatus: number;
}

export interface ServiceCategory {
  ServiceCategoryID: number;
  ServiceID: number;
  CategoryID: number;
  CategoryName?: string;
  CategoryDescription?: string;
  CategoryImage?: string;
  DisplayOrder: number;
  ActiveStatus: number;
}

export interface IndustryFaq {
  IndustryFaqID: number;
  IndustryID: number;
  Question: string;
  Answer: string;
  DisplayOrder: number;
  ActiveStatus: number;
}

export interface IndustrySolution {
  IndustrySolutionID: number;
  IndustryID: number;
  SolutionName: string;
  SolutionDescription?: string;
  SolutionImage?: string;
  DisplayOrder: number;
  ActiveStatus: number;
}

export interface PortfolioHighlight {
  HighlightID: number;
  PortfolioID: number;
  HighlightTitle?: string;
  HighlightDescription?: string;
  HighlightValue?: string;
  DisplayOrder: number;
}

export interface CareerApplication {
  ApplicationID: number;
  CareerID: number;
  ApplicantName: string;
  ApplicantEmail: string;
  ApplicantPhone?: string;
  ResumeFile?: string;
  CoverLetter?: string;
  PostedDate?: string;
}

export interface PageMeta {
  MetaTitle?: string;
  MetaKeywords?: string;
  MetaDescriptions?: string;
  MetaSchema?: string;
  MetaOgImage?: string;
}
