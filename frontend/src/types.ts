export type Vehicle = {
  id: string
  title: string
  brand: string
  model: string
  year: number
  priceXof: number
  mileageKm: number
  fuel: string
  transmission: string
  description: string
  images: string[]
  status: 'DRAFT' | 'PUBLISHED' | 'SOLD'
  createdAt?: string
}

export type Inquiry = {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  vehicleId: string | null
  createdAt: string
  vehicle: { id: string; title: string } | null
}
