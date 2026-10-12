export type FormValues = {
  name: string
  cnp: string
  ca: string
  address: string
  phone: string
  email: string
  iban: string
  bank: string
  bank_branch: string
  owner: string
  ocnp: string
  clinic_0: string
  medic_0: string
  specialty_0: string
  date: string
}

export const emptyFormValues: FormValues = {
  name: '',
  cnp: '',
  ca: '',
  address: '',
  phone: '',
  email: '',
  iban: '',
  bank: '',
  bank_branch: '',
  owner: '',
  ocnp: '',
  clinic_0: '',
  medic_0: '',
  specialty_0: '',
  date: '',
}
