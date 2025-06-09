import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithAuth } from "../baseQueryWithAuth"

export const competitorsApi = createApi({
  reducerPath: "competitorsApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Competitor"],
  endpoints: (builder) => ({
    // GET /competitors (con parámetro search opcional)
    getCompetitors: builder.query({
      query: (params = {}) => ({
        url: "competitors",
        method: "GET",
        params, // Para el parámetro 'search'
      }),
      providesTags: (result = []) =>
        Array.isArray(result)
          ? result.map((c) => ({ type: "Competitor", id: c.id }))
          : [{ type: "Competitor", id: "LIST" }],
      transformResponse: (response) => {
        console.log("Get competitors response:", response)
        return response
      },
    }),

    // GET /competitors/search?ci={ci}
    searchCompetitorByCi: builder.query({
      query: (ci) => ({
        url: "competitors/search",
        method: "GET",
        params: { ci },
      }),
      providesTags: (result = []) =>
        Array.isArray(result)
          ? result.map((c) => ({ type: "Competitor", id: c.id }))
          : [{ type: "Competitor", id: "LIST" }],
      transformResponse: (response) => {
        console.log("Search competitor by CI response:", response)
        return response
      },
    }),

    // GET /competitors/{id}
    getCompetitor: builder.query({
      query: (id) => ({
        url: `competitors/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Competitor", id }],
      transformResponse: (response) => {
        console.log("Get competitor response:", response)
        return response
      },
    }),

    // POST /competitors (Crea competidor + inscripción)
    postInscriptionCompetitor: builder.mutation({
      query: (data) => ({
        url: "competitors",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Competitor", id: "LIST" }],
      transformResponse: (response) => {
        console.log("Post inscription competitor response:", response)
        return response
      },
      transformErrorResponse: (response) => {
        console.error("Post inscription competitor error:", response)
        return response.data || response
      },
    }),

    // PUT /competitors/{id}
    updateCompetitor: builder.mutation({
      query: ({ id, data }) => ({
        url: `competitors/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Competitor", id },
        { type: "Competitor", id: "LIST" },
      ],
      transformResponse: (response) => {
        console.log("Update competitor response:", response)
        return response
      },
      transformErrorResponse: (response) => {
        console.error("Update competitor error:", response)
        return response.data || response
      },
    }),

    // DELETE /competitors/{id}
    deleteCompetitor: builder.mutation({
      query: (id) => ({
        url: `competitors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Competitor", id },
        { type: "Competitor", id: "LIST" },
      ],
      transformResponse: (response) => {
        console.log("Delete competitor response:", response)
        return response
      },
      transformErrorResponse: (response) => {
        console.error("Delete competitor error:", response)
        return response.data || response
      },
    }),

    // POST /competitors/bulk-upload (no /competitors/import)
    importCompetitors: builder.mutation({
      query: (formData) => ({
        url: "competitors/bulk-upload",
        method: "POST",
        body: formData,
        // No establecer Content-Type para FormData
      }),
      invalidatesTags: [{ type: "Competitor", id: "LIST" }],
      transformResponse: (response) => {
        console.log("Import competitors response:", response)
        return response
      },
      transformErrorResponse: (response) => {
        console.error("Import competitors error:", response)
        return response.data || response
      },
    }),
  }),
})

export const {
  useGetCompetitorsQuery,
  useSearchCompetitorByCiQuery,
  useGetCompetitorQuery,
  usePostInscriptionCompetitorMutation,
  useUpdateCompetitorMutation,
  useDeleteCompetitorMutation,
  useImportCompetitorsMutation,

  // Lazy queries
  useLazyGetCompetitorsQuery,
  useLazySearchCompetitorByCiQuery,
  useLazyGetCompetitorQuery,
} = competitorsApi
