export interface Member {
  id: string
  slug: string
  fullName: string
  nickname: string | null
  gender: string
  birthDate: string | null
  birthPlace: string | null
  deathDate: string | null
  deathPlace: string | null
  isAlive: boolean
  religion: string | null
  occupation: string | null
  bio: string | null
  photoUrl: string | null
  address: string | null
  generation: number
  createdAt: string | Date
  updatedAt: string | Date
  deletedAt: string | Date | null
}

export interface Relationship {
  id: string
  memberId: string
  relatedMemberId: string
  relationType: string
  marriageDate: string | null
  createdAt: string | Date
}

export interface MemberWithRelations extends Member {
  parents: Member[]
  spouses: Member[]
  children: Member[]
  birthOrder?: number
  totalSiblings?: number
}

export interface FamilyTreeNode {
  id: string
  type: "familyMember"
  position: { x: number; y: number }
  data: {
    member: Member
    onClick: (slug: string) => void
  }
}

export interface FamilyTreeEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
  type?: string
  data?: {
    relationType: string
  }
}
