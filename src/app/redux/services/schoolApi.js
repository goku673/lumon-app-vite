import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '../baseQueryWithAuth';


export const schoolApi = createApi({
  reducerPath: 'schoolApi',
  baseQuery: baseQueryWithAuth,

  tagTypes: ['Schools'],
  endpoints: (builder) => ({
    getSchools: builder.query({
      query: () => ({
        url: '/schools',
        method: 'GET',
      }),
      providesTags: ['Schools']
    }),
  })
});

export const {
    useGetSchoolsQuery
} = schoolApi;
