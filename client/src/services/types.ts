export interface Consultation {
  id: string
  consultDate: string
  time: string
  bloodPressure: string
  frequency: string
  saturation: number
  glycemia: number
  anamnesis: string
  duration: number
  icdCode: string
  medication: string
  patientId: string
}

export interface Patient {
  id: string
  cpf: string
  name: string
  motherName: string
  birthDate: string
  doctorId: string
  consultations: Consultation[]
}

export interface GetPatientsResponse {
  patients: Patient[]
}
