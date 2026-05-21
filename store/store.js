import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import { authAPISlice } from "./backendSlice/authAPISlice";
import { staticAPISlice } from "./backendSlice/staticAPISlice";
import { collegeAPISlice } from "./backendSlice/collegeAPISlice";
import { categoryAPISlice } from "./backendSlice/categoryAPISlice";
import { pageAPISlice } from "./backendSlice/pageAPISlice";
import { industryAPISlice } from "./backendSlice/industryAPISlice";
import { logoAPISlice } from "./backendSlice/logoAPISlice";
import { trustedPartnerAPISlice } from "./backendSlice/trustedPartnerAPISlice";
import { testimonialAPISlice } from "./backendSlice/testimonialAPISlice";
import { teamAPISlice } from "./backendSlice/teamAPISlice";
import { authorAPISlice } from "./backendSlice/authorAPISlice";
import { milestoneAPISlice } from "./backendSlice/milestoneAPISlice";
import { portfolioAPISlice } from "./backendSlice/portfolioAPISlice";
import { contactUsAPISlice } from "./backendSlice/contactUsAPISlice";
import { siebelExpertAPISlice } from "./backendSlice/siebelExpertAPISlice";
import { serviceAPISlice } from "./backendSlice/serviceAPISlice";
import { careerAPISlice } from "./backendSlice/careerAPISlice";
import adminAuthReducer from "./backendSlice/adminAuthReducer";
import homeReducer from "./frontendSlice/homeSlice";
import aboutReducer from "./frontendSlice/aboutSlice";
import { frontendAPISlice } from "./frontendSlice/frontendAPISlice";
import contactReducer from "./frontendSlice/contactSlice";
import blogReducer from "./frontendSlice/blogSlice";
import caseReducer from "./frontendSlice/caseSlice";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [authAPISlice.reducerPath]: authAPISlice.reducer,
    [staticAPISlice.reducerPath]: staticAPISlice.reducer,
    [collegeAPISlice.reducerPath]: collegeAPISlice.reducer,
    [categoryAPISlice.reducerPath]: categoryAPISlice.reducer,
    [pageAPISlice.reducerPath]: pageAPISlice.reducer,
    [industryAPISlice.reducerPath]: industryAPISlice.reducer,
    [logoAPISlice.reducerPath]: logoAPISlice.reducer,
    [trustedPartnerAPISlice.reducerPath]: trustedPartnerAPISlice.reducer,
    [testimonialAPISlice.reducerPath]: testimonialAPISlice.reducer,
    [teamAPISlice.reducerPath]: teamAPISlice.reducer,
    [authorAPISlice.reducerPath]: authorAPISlice.reducer,
    [milestoneAPISlice.reducerPath]: milestoneAPISlice.reducer,
    [portfolioAPISlice.reducerPath]: portfolioAPISlice.reducer,
    [contactUsAPISlice.reducerPath]: contactUsAPISlice.reducer,
    [siebelExpertAPISlice.reducerPath]: siebelExpertAPISlice.reducer,
    [serviceAPISlice.reducerPath]: serviceAPISlice.reducer,
    [careerAPISlice.reducerPath]: careerAPISlice.reducer,
    adminAuth: adminAuthReducer,
    home: homeReducer,
    about: aboutReducer,
    contact: contactReducer,
    blog: blogReducer,
    case: caseReducer,
    [frontendAPISlice.reducerPath]: frontendAPISlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(baseApi.middleware)
      .concat(authAPISlice.middleware)
      .concat(staticAPISlice.middleware)
      .concat(collegeAPISlice.middleware)
      .concat(categoryAPISlice.middleware)
      .concat(pageAPISlice.middleware)
      .concat(industryAPISlice.middleware)
      .concat(logoAPISlice.middleware)
      .concat(trustedPartnerAPISlice.middleware)
      .concat(testimonialAPISlice.middleware)
      .concat(teamAPISlice.middleware)
      .concat(authorAPISlice.middleware)
      .concat(milestoneAPISlice.middleware)
      .concat(portfolioAPISlice.middleware)
      .concat(contactUsAPISlice.middleware)
      .concat(siebelExpertAPISlice.middleware)
      .concat(serviceAPISlice.middleware)
      .concat(careerAPISlice.middleware)
      .concat(frontendAPISlice.middleware),
  devTools: process.env.NODE_ENV !== "production",
});
