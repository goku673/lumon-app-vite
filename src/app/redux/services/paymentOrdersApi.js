import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithAuth } from "../baseQueryWithAuth"

export const paymentOrdersApi = createApi({
  reducerPath: "paymentOrdersApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["PaymentOrder"],
  endpoints: (builder) => ({
    // POST /payment-orders/generate/{inscriptionId} (CORREGIDO)
    generatePaymentByInscription: builder.mutation({
      query: (inscriptionId) => ({
        url: `payment-orders/generate/${inscriptionId}`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "PaymentOrder", id: "LIST" }],
      transformResponse: (response) => {
        console.log("Generate payment by inscription response:", response)
        return response
      },
      transformErrorResponse: (response) => {
        console.error("Generate payment by inscription error:", response)
        return response.data || response
      },
    }),

    // POST /payment-orders/validate (CORREGIDO)
    validatePaymentFromImage: builder.mutation({
      query: (formData) => ({
        url: "payment-orders/validate",
        method: "POST",
        body: formData,
        // No establecer Content-Type para FormData, el navegador lo hará automáticamente
      }),
      invalidatesTags: [{ type: "PaymentOrder", id: "LIST" }],
      transformResponse: (response) => {
        console.log("Validate payment from image response:", response)
        return response
      },
      transformErrorResponse: (response) => {
        console.error("Validate payment from image error:", response)
        return response.data || response
      },
    }),

    // POST /payment-orders/generate-school/{schoolId} (CORREGIDO)
    generatePaymentBySchool: builder.mutation({
      query: (schoolId) => ({
        url: `payment-orders/generate-school/${schoolId}`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "PaymentOrder", id: "LIST" }],
      transformResponse: (response) => {
        console.log("Generate payment by school response:", response)
        return response
      },
      transformErrorResponse: (response) => {
        console.error("Generate payment by school error:", response)
        return response.data || response
      },
    }),

    // GET /payment-orders (si tienes este endpoint en el backend)
    getPaymentOrders: builder.query({
      query: (params = {}) => ({
        url: "payment-orders",
        method: "GET",
        params,
      }),
      providesTags: (result = []) =>
        Array.isArray(result)
          ? result.map((order) => ({ type: "PaymentOrder", id: order.id }))
          : [{ type: "PaymentOrder", id: "LIST" }],
      transformResponse: (response) => {
        console.log("Get payment orders response:", response)
        return response
      },
    }),

    // GET /payment-orders/{id} (si tienes este endpoint en el backend)
    getPaymentOrder: builder.query({
      query: (id) => ({
        url: `payment-orders/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "PaymentOrder", id }],
      transformResponse: (response) => {
        console.log("Get payment order response:", response)
        return response
      },
    }),
  }),
})

export const {
  useGeneratePaymentByInscriptionMutation,
  useValidatePaymentFromImageMutation,
  useGeneratePaymentBySchoolMutation,
  useGetPaymentOrdersQuery,
  useGetPaymentOrderQuery,

  // Lazy queries
  useLazyGetPaymentOrdersQuery,
  useLazyGetPaymentOrderQuery,
} = paymentOrdersApi
