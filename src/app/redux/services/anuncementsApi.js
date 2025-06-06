import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '../baseQueryWithAuth';



export const announcementsApi = createApi({
  reducerPath: 'announcementsApi',
  baseQuery: baseQueryWithAuth,

  tagTypes: ['Announcement'],

  endpoints: (builder) => ({
    getAnnouncements: builder.query({
      query: () => ({
        url: '/announcements',
        method: 'GET',
      }),
     
    }),
    getAnnouncement: builder.query({
      query: (id) => ({
        url: `/announcements/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Announcement', id }],
    }),
    createAnnouncement: builder.mutation({
      query: (data) => {
        
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        
        if (data.image1) {
          formData.append('image1', data.image1);
        }
        
        if (data.image2) {
          formData.append('image2', data.image2);
        }
        
        return {
          url: '/announcements',
          method: 'POST',
          body: formData,
         
        };
      },
      invalidatesTags: [{ type: 'Announcement', id: 'LIST' }],
    }),
    updateAnnouncement: builder.mutation({
      query: ({ id, data }) => {
        const formData = new FormData();
        
        if (data.title) {
          formData.append('title', data.title);
        }
        
        if (data.description) {
          formData.append('description', data.description);
        }
        
        if (data.image1) {
          formData.append('image1', data.image1);
        }
        
        if (data.image2) {
          formData.append('image2', data.image2);
        }
        
        return {
          url: `/announcements/${id}`,
          method: 'POST', 
          body: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Announcement', id }],
    }),
    deleteAnnouncement: builder.mutation({
      query: (id) => ({
        url: `/announcements/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Announcement', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetAnnouncementsQuery,
  useGetAnnouncementQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
} = announcementsApi;