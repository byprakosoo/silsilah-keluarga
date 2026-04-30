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
      <div className="max-w-[var(--container-max)] w-full mx-auto px-[var(--gutter)] pt-8 pb-4 shrink-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1
              className="font-serif font-bold text-[var(--on-surface)] mb-1"
              style={{
                fontFamily: "var(--font-noto-serif), serif",
                fontSize: "3.5rem",
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

      <div className="flex-1 min-h-0 px-[var(--gutter)] pb-6">
        <FamilyTreeClient members={members} relationships={relationships} />
      </div>
    </div>
  );
}
