import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '../baseQueryWithAuth';



export const guardiansApi = createApi({
  reducerPath: 'guardiansApi',
  baseQuery: baseQueryWithAuth,

  tagTypes: ['Guardians'],
  endpoints: (builder) => ({
    getGuardians: builder.query({
      query: () => ({
        url: '/guardians',
        method: 'GET',
      }),
      providesTags: ['Guardians']
    }),
    postIncriptionGuardian: builder.mutation({
      query: (data) => ({
        url: '/guardians',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Guardians']
    }),
  })
});

export const {
    usePostIncriptionGuardianMutation,
    useGetGuardiansQuery,
} = guardiansApi;
