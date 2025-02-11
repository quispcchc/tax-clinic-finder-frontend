export interface Client {
  id?: number;
  client_id: number;
  appointment_type?: string;
  type_of_clinic?: string;
  wheelchair_accessible?: string;
  geographical_zone?: string;
  days_of_operation?: string;
  hours_of_operation?: string;
  supported_tax_years?: string;
  province_of_residence?: string;
  language_options?: string;
  population_serve?: string;
  help_access_documents?: string;
  special_cases?: string;
  clinics_listed?: string;
  assigned_clinic?: string;
  unassigned_clinic?: string;
  created_by?: string;
}
