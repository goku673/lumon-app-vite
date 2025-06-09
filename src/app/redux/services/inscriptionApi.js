import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithAuth } from "../baseQueryWithAuth"

export const inscriptionsApi = createApi({
  reducerPath: "inscriptionsApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Inscription"],
  endpoints: (builder) => ({
    // POST /inscriptions (Crea inscripción para competidor existente)
    createInscription: builder.mutation({
      query: (data) => ({
        url: "inscriptions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Inscription", id: "LIST" }],
      transformResponse: (response) => {
        console.log("Create inscription response:", response)
        return response
      },
      transformErrorResponse: (response) => {
        console.error("Create inscription error:", response)
        return response.data || response
      },
    }),

    // GET /inscriptions (Obtiene todas las inscripciones)
    getInscriptions: builder.query({
      query: (params = {}) => ({
        url: "inscriptions",
        method: "GET",
        params,
      }),
      providesTags: (result = []) =>
        Array.isArray(result)
          ? result.map((inscription) => ({ type: "Inscription", id: inscription.id }))
          : [{ type: "Inscription", id: "LIST" }],
      transformResponse: (response) => {
        console.log("Get inscriptions response:", response)
        return response
      },
    }),

    // GET /inscriptions/{id} (Obtiene una inscripción específica)
    getInscription: builder.query({
      query: (id) => ({
        url: `inscriptions/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Inscription", id }],
      transformResponse: (response) => {
        console.log("Get inscription response:", response)
        return response
      },
    }),

    // GET /inscriptions/by-school/{schoolId} (Obtiene inscripciones por ID de colegio)
    getInscriptionsBySchool: builder.query({
      query: (schoolId) => ({
        url: `inscriptions/by-school/${schoolId}`,
        method: "GET",
      }),
      providesTags: (result = []) =>
        Array.isArray(result)
          ? result.map((inscription) => ({ type: "Inscription", id: inscription.id }))
          : [{ type: "Inscription", id: "LIST" }],
      transformResponse: (response) => {
        console.log("Get inscriptions by school response:", response)
        return response
      },
    }),

    // GET /inscriptions/by-olympic/{olympicId} (Obtiene inscripciones por ID de olimpiada)
    getInscriptionsByOlympic: builder.query({
      query: (olympicId) => ({
        url: `inscriptions/by-olympic/${olympicId}`,
        method: "GET",
      }),
      providesTags: (result = []) =>
        Array.isArray(result)
          ? result.map((inscription) => ({ type: "Inscription", id: inscription.id }))
          : [{ type: "Inscription", id: "LIST" }],
      transformResponse: (response) => {
        console.log("Get inscriptions by olympic response:", response)
        return response
      },
    }),
  }),
})

export const {
  useCreateInscriptionMutation,
  useGetInscriptionsQuery,
  useGetInscriptionQuery,
  useGetInscriptionsBySchoolQuery,
  useGetInscriptionsByOlympicQuery,

  // Lazy queries
  useLazyGetInscriptionsQuery,
  useLazyGetInscriptionQuery,
  useLazyGetInscriptionsBySchoolQuery,
  useLazyGetInscriptionsByOlympicQuery,
} = inscriptionsApi
