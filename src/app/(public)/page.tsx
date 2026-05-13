import { Suspense } from "react";
import { FamilyTreeClient } from "@/components/family-tree/family-tree-client";
import { SearchBar } from "@/components/public/search-bar";
import { getTreeMembers, getSearchItems } from "@/lib/actions/members";
import { getRelationships } from "@/lib/actions/relationships";

export const revalidate = 3600;

export default async function HomePage() {
  const searchableMembers = await getSearchItems();

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
              style={{ fontFamily: "var(--font-elms-sans), sans-serif" }}
            >
              Geser dan zoom untuk melihat silsilah keluarga secara lengkap
            </p>
          </div>
          <SearchBar members={searchableMembers} />
        </div>
      </div>

      <div className="flex-1 min-h-0 px-2 sm:px-[var(--gutter)] pb-2 sm:pb-6">
        <Suspense fallback={<TreeSkeleton />}>
          <TreeSection />
        </Suspense>
      </div>
    </div>
  );
}

async function TreeSection() {
  const [members, relationships] = await Promise.all([
    getTreeMembers(),
    getRelationships(),
  ]);

  return <FamilyTreeClient members={members} relationships={relationships} />;
}

function TreeSkeleton() {
  return (
    <div
      className="w-full h-full rounded-xl sm:rounded-2xl overflow-hidden border animate-pulse"
      style={{
        backgroundColor: "var(--parchment)",
        borderColor: "var(--ledger-line)",
      }}
    >
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full border-2 flex items-center justify-center"
            style={{ borderColor: "var(--gold-accent)" }}
          >
            <div
              className="w-8 h-8 rounded-full"
              style={{ backgroundColor: "var(--primary-container)" }}
            />
          </div>
          <p
            className="text-sm"
            style={{
              fontFamily: "var(--font-elms-sans), sans-serif",
              color: "var(--on-surface-variant)",
            }}
          >
            Menyusun silsilah keluarga…
          </p>
        </div>
      </div>
    </div>
  );
}
