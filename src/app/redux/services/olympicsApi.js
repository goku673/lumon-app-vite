import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '../baseQueryWithAuth';



export const olympicsApi = createApi({
  reducerPath: 'olympicsApi',
  baseQuery: baseQueryWithAuth,

  
  tagTypes: ['Olympics'],
  endpoints: (builder) => ({
    getOlympics: builder.query({
      query: () => ({
        url: '/olympics',
        method: 'GET',
      }),
      providesTags: ['Olympics']
    }),
    postIncriptionOlympics: builder.mutation({
      query: (data) => ({
        url: '/olympics',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Olympics']
    }),
    
    // GET /olympics/active - Obtener olimpiadas activas
    getActiveOlympics: builder.query({
      query: () => ({
        url: '/olympics/active',
        method: 'GET',
      }),
      providesTags: ['Olympics']
    }),

    // GET /olympics/{id} - Obtener una olimpiada específica
    getOlympicById: builder.query({
      query: (id) => ({
        url: `/olympics/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Olympics', id }]
    }),
    // PUT /olympics/{id} - Actualizar olimpiada
    updateOlympic: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/olympics/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Olympics', id },
        'Olympics'
      ]
    }),
    // DELETE /olympics/{id} - Deshabilitar olimpiada (soft delete)
    deleteOlympic: builder.mutation({
      query: (id) => ({
        url: `/olympics/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Olympics', id },
        'Olympics'
      ]
    }),

  })
});

export const {
    usePostIncriptionOlympicsMutation,
    useGetOlympicsQuery,
    useGetActiveOlympicsQuery,
    useUpdateOlympicMutation,
    useDeleteOlympicMutation,
    useGetOlympicByIdQuery
} = olympicsApi;
