export type StudentStatus = "active" | "inactive";

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  class: string;
  status: StudentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentInput {
  name: string;
  email: string;
  phone: string;
  class: string;
  status: StudentStatus;
}

export type UpdateStudentInput = Partial<CreateStudentInput>;

export type SortField = "name" | "createdAt" | "class";
export type SortOrder = "ASC" | "DESC";

export interface StudentsQueryParams {
  search?: string;
  status?: StudentStatus;
  class?: string;
  page: number;
  limit: number;
  sortBy: SortField;
  sortOrder: SortOrder;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedStudents {
  data: Student[];
  meta: PaginationMeta;
}
