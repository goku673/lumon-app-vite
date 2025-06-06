import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '../baseQueryWithAuth';


export const areaApi = createApi({
  reducerPath: 'areaApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Areas', 'Provinces', 'Departments'],
  
  endpoints: (builder) => ({
    getAreas : builder.query({
      query: () => ({
        url: '/areas',
        method: 'GET',
      }),
      invalidatesTags: ['Areas'],
    }),
    getProvinces: builder.query({
      query: () => ({
        url: '/provinces',
        method: 'GET',
      }),
      providesTags: ['Provinces']
    }),
    getDepartments: builder.query({
      query: () => ({
        url: '/departments',
        method: 'GET',
      }),
      providesTags: ['Departments']
    }),
    postIncriptionArea : builder.mutation({
      query: (data) => ({
        url: '/areas',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Areas']
    }),
    deleteArea : builder.mutation({
      query: (id) => ({
        url: `/areas/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Areas'],
    }),
      
  })
});

export const {
  useGetAreasQuery,
  useGetProvincesQuery,
  useGetDepartmentsQuery,
  usePostIncriptionAreaMutation,
  useDeleteAreaMutation,
} = areaApi;
