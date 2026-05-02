import { FamilyTreeClient } from "@/components/family-tree/family-tree-client";
import { SearchBar } from "@/components/public/search-bar";
import { getAllMembers, getSearchItems } from "@/lib/actions/members";
import { getRelationships } from "@/lib/actions/relationships";

export const revalidate = 3600;

export default async function HomePage() {
  const [members, relationships, searchableMembers] = await Promise.all([
    getAllMembers(),
    getRelationships(),
    getSearchItems(),
  ]);

  return (
    <div className="h-[calc(100dvh-4rem)] flex flex-col">
      <div className="max-w-[var(--container-max)] w-full mx-auto px-4 sm:px-[var(--gutter)] pt-4 sm:pt-8 pb-2 sm:pb-4 shrink-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1
              className="font-serif font-bold text-[var(--on-surface)] mb-1"
              style={{
                fontFamily: "var(--font-noto-serif), serif",
                fontSize: "clamp(1.75rem, 5vw, 3.5rem)",
                lineHeight: "1.2",
                letterSpacing: "-0.02em",
              }}
            >
              Keluarga Muhammad Bin Abdul Gani
            </h1>
            <p
              className="body-lg text-[var(--on-surface-variant)]"
              style={{ fontFamily: "var(--font-source-sans), sans-serif" }}
            >
              Geser dan zoom untuk melihat silsilah keluarga secara lengkap
            </p>
          </div>
          <SearchBar members={searchableMembers} />
        </div>
      </div>

      <div className="flex-1 min-h-0 px-2 sm:px-[var(--gutter)] pb-2 sm:pb-6">
        <FamilyTreeClient members={members} relationships={relationships} />
      </div>
    </div>
  );
}
