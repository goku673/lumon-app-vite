import { configureStore } from "@reduxjs/toolkit";
import { registerApi } from "./services/register";
import { areaApi } from "./services/areaApi";
import { guardiansApi } from "./services/guardiansApi";
import guardianReducer from "./slice/guardianSlice";
import olympicReducer from "./slice/olympicsSlice";
import { schoolApi } from "./services/schoolApi";
import { olympicsApi } from "./services/olympicsApi";
import { gradesApi } from "./services/gradesApi";
import { levelsApi } from "./services/levelsApi";
import { areaLevelsGradesApi } from "./services/areaLevelsGrades";
import { competitorsApi } from "./services/competitorsApi";
import { announcementsApi } from "./services/anuncementsApi";
import { authApi } from "./services/authApi";

export const store = configureStore({
  reducer: {
    [registerApi.reducerPath]: registerApi.reducer,
    [areaApi.reducerPath]: areaApi.reducer,
    [guardiansApi.reducerPath]: guardiansApi.reducer,
    [schoolApi.reducerPath]: schoolApi.reducer,
    [olympicsApi.reducerPath]: olympicsApi.reducer,
    [gradesApi.reducerPath]: gradesApi.reducer,
    [levelsApi.reducerPath]: levelsApi.reducer,
    [areaLevelsGradesApi.reducerPath]: areaLevelsGradesApi.reducer,
    [competitorsApi.reducerPath]: competitorsApi.reducer,
    [announcementsApi.reducerPath]: announcementsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    guardian: guardianReducer,
    olympic: olympicReducer,
  },
  
  middleware : (getDefaulMiddleware) => 
    getDefaulMiddleware().concat(
      registerApi.middleware,
      areaApi.middleware,
      guardiansApi.middleware,
      schoolApi.middleware,
      olympicsApi.middleware,
      gradesApi.middleware,
      levelsApi.middleware,
      areaLevelsGradesApi.middleware,
      competitorsApi.middleware,
      announcementsApi.middleware,
      authApi.middleware,
    ),
});


