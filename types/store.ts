import type { store } from "@/store/store";
import type { HomeData, HeaderData } from "./composites";
import type { ContactUs, Industry, User } from "./entities";
import type { ApiSuccessResponse } from "./api";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export interface AdminAuthState {
  adminUser: Pick<User, "loginID" | "UserName"> | null;
  isLoggedIn: boolean;
  token: string | null;
}

export interface HomeState {
  homeData: HomeData | null;
  error: string | null;
  loading: boolean;
  industryData: unknown | null;
  industryDataLoading: boolean;
  industryDataError: string | null;
}

export interface AboutState {
  aboutData: unknown | null;
  aboutError: string | null;
  aboutLoading: boolean;
}

export interface ContactState {
  contactData: ContactUs | null;
  industriesList: Industry[] | null;
  contactError: string | null;
  contactLoading: boolean;
  industriesLoading: boolean;
  industriesError: string | null;
}

export interface BlogState {
  blogData: unknown[] | null;
  blogError: string | null;
  blogLoading: boolean;
}

export interface CaseState {
  caseData: unknown[] | null;
  caseError: string | null;
  caseLoading: boolean;
}

export interface HeaderDataContextValue {
  headerPayload: ApiSuccessResponse<HeaderData> | null;
  isLoading: boolean;
}

export interface AdminModalState {
  isUpdateStatusOpen: boolean;
  openUpdateStatus: () => void;
  closeUpdateStatus: () => void;
}

export interface FrontendModalState {
  isHamOpen: boolean;
  isEnquireOpen: boolean;
  isVideoOpen: boolean;
  isTeamPopOpen: boolean;
  isThankyouOpen: boolean;
  isRegionPopOpen: boolean;
  isJobFormOpen: boolean;
  selectedTeamMember: unknown | null;
  openTeamPop: (teamMember: unknown) => void;
  closeTeamPop: () => void;
  openJobForm: () => void;
  closeJobForm: () => void;
  openRegionPop: () => void;
  closeRegionPop: () => void;
  openHam: () => void;
  closeHam: () => void;
  openEnquire: () => void;
  closeEnquire: () => void;
  openVideo: () => void;
  closeVideo: () => void;
  openThankyouPop: () => void;
  closeThankyouPop: () => void;
  closeAll: () => void;
}
