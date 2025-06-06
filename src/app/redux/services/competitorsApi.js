import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '../baseQueryWithAuth';


export const competitorsApi = createApi({
  reducerPath: 'competitorsApi',
  baseQuery: baseQueryWithAuth,
  
  tagTypes: ['Competitor'],
  endpoints: (builder) => ({
    getCompetitors: builder.query({
      query: () => ({
        url: 'competitors',
        method: 'GET',
      }),
      providesTags: (result = []) =>
        result.map((c) => ({ type: 'Competitor', id: c.id })),
    }),
    searchCompetitorByCi: builder.query({
      query: (ci) => ({
        url: `competitors/search?ci=${ci}`,
        method: 'GET',
      }),
      providesTags: (result = []) =>
        Array.isArray(result)
          ? result.map((c) => ({ type: 'Competitor', id: c.id }))
          : [],
    }),
    postInscriptionCompetitor: builder.mutation({
      query: (data) => ({
        url: 'competitors',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Competitor', id: 'LIST' }],
    }),
    deleteCompetitor: builder.mutation({
      query: (id) => ({
        url: `competitors/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Competitor', id: 'LIST' }],
    }), 
    getCompetitor: builder.query({
      query: (id) => ({
        url: `competitors/${id}`,
        method: 'GET',
      }),
    }),
    updateCompetitor: builder.mutation({
      query: ({ id, data }) => ({
        url: `competitors/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: [{ type: 'Competitor', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetCompetitorsQuery,
  useSearchCompetitorByCiQuery,
  usePostInscriptionCompetitorMutation,
  useDeleteCompetitorMutation,
  useGetCompetitorQuery,
  useUpdateCompetitorMutation,
} = competitorsApi;