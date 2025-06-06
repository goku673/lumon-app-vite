import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '../baseQueryWithAuth';



export const registerApi = createApi({
  reducerPath: 'registerApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Grades'],

  endpoints: (builder) => ({
 
    getGrades: builder.query({
      query: () => ({
        url: '/grades',
        method: 'GET',
      }),
    }),
  })
});

export const {
  
  useGetGradesQuery,
 
} = registerApi;
