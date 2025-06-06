import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '../baseQueryWithAuth';


export const levelsApi = createApi({
  reducerPath: 'levelsApi',
  baseQuery: baseQueryWithAuth,

  tagTypes: ['Levels'],
  endpoints: (builder) => ({
    getLevels: builder.query({
      query: () => ({
        url: '/levels',
        method: 'GET',
      }),
      providesTags: ['Levels']
    }),
    postIncriptionLevels: builder.mutation({
      query: (data) => ({
        url: '/levels',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Levels']
    }),
  })
});

export const {
    useGetLevelsQuery,
    usePostIncriptionLevelsMutation,
} = levelsApi;
