import { api } from "@/store/api";
import type {
  CreateStudentInput,
  PaginatedStudents,
  Student,
  StudentsQueryParams,
  UpdateStudentInput,
} from "@/features/students/types";

export const studentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    listStudents: builder.query<PaginatedStudents, StudentsQueryParams>({
      query: (params) => ({
        url: "/students",
        params: {
          ...params,
          // Omit empty filters instead of sending "?status=&class=" —
          // the backend's DTO treats an empty string as an actual filter value.
          status: params.status || undefined,
          class: params.class || undefined,
          search: params.search || undefined,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Student" as const, id })),
              { type: "Student" as const, id: "LIST" },
            ]
          : [{ type: "Student" as const, id: "LIST" }],
    }),

    getStudent: builder.query<Student, string>({
      query: (id) => `/students/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Student", id }],
    }),

    getStudentClasses: builder.query<string[], void>({
      query: () => "/students/meta/classes",
      providesTags: ["StudentClasses"],
    }),

    createStudent: builder.mutation<Student, CreateStudentInput>({
      query: (body) => ({ url: "/students", method: "POST", body }),
      invalidatesTags: [{ type: "Student", id: "LIST" }, "StudentClasses"],
    }),

    updateStudent: builder.mutation<Student, { id: string; body: UpdateStudentInput }>({
      query: ({ id, body }) => ({ url: `/students/${id}`, method: "PATCH", body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Student", id },
        { type: "Student", id: "LIST" },
        "StudentClasses",
      ],
    }),

    deleteStudent: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/students/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Student", id },
        { type: "Student", id: "LIST" },
        "StudentClasses",
      ],
    }),
  }),
});

export const {
  useListStudentsQuery,
  useGetStudentQuery,
  useGetStudentClassesQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = studentsApi;
