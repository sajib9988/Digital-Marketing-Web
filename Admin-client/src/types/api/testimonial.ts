export type Testimonial = {
  id: string
  clientId: string
  content: string
  rating: number | null
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export type CreateTestimonialInput = {
  clientId: string
  content: string
  rating?: number
  isPublished?: boolean
}

export type UpdateTestimonialInput = Partial<CreateTestimonialInput>
