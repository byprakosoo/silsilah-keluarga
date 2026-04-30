import { z } from "zod"

export const memberSchema = z.object({
  fullName: z.string().min(1, "Nama wajib diisi").max(255),
  nickname: z.string().max(100).optional(),
  gender: z.enum(["male", "female"], { message: "Pilih jenis kelamin" }),
  birthDate: z.string().optional(),
  birthPlace: z.string().max(255).optional(),
  deathDate: z.string().optional(),
  deathPlace: z.string().max(255).optional(),
  isAlive: z.boolean().default(true),
  religion: z.string().max(100).optional(),
  occupation: z.string().max(255).optional(),
  bio: z.string().optional(),
  generation: z.number().int().min(1).max(10).default(1),
  photoUrl: z.string().optional(),
  address: z.string().max(500).optional(),
})

export type MemberInput = z.infer<typeof memberSchema>

export const relationSchema = z.object({
  memberId: z.string().uuid(),
  fatherId: z.string().uuid().optional().nullable(),
  motherId: z.string().uuid().optional().nullable(),
  spouseId: z.string().uuid().optional().nullable(),
  marriageDate: z.string().optional().nullable(),
})

export type RelationInput = z.infer<typeof relationSchema>

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
})
