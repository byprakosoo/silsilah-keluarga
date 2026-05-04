import { notFound } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Heart,
  Gift,
  Hourglass,
  BookOpen,
  TrendingUp,
  Moon,
} from "lucide-react";
import { getMemberBySlugWithRelations } from "@/lib/actions/members";
import { formatDate, getYearSpan, getGenerationLabel } from "@/lib/tree-utils";
import { MemberWithRelations } from "@/lib/types";

interface ProfilePageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

function calculateAge(
  birthDateStr: string,
  deathDateStr: string,
): number | null {
  const birth = new Date(birthDateStr);
  const death = new Date(deathDateStr);
  if (isNaN(birth.getTime()) || isNaN(death.getTime())) return null;
  let age = death.getFullYear() - birth.getFullYear();
  const m = death.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && death.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { slug } = await params;
  const member = await getMemberBySlugWithRelations(slug);

  if (!member) {
    notFound();
  }

  const initials = getInitials(member.fullName);

  const generationBadge = (() => {
    const label = getGenerationLabel(member.generation);
    const short = label.length <= 8 ? label : `Gen ${member.generation}`;
    return short.toUpperCase();
  })();

  const age =
    member.birthDate && member.deathDate
      ? calculateAge(member.birthDate, member.deathDate)
      : null;

  const bioParagraphs = member.bio
    ? member.bio.split("\n").filter((p) => p.trim())
    : [];

  return (
    <div
      className="max-w-[var(--container-max)] mx-auto px-4 sm:px-[var(--gutter)]"
      style={{ paddingTop: "var(--gutter)", paddingBottom: "var(--gutter)" }}
    >
      {/* Back Link */}
      <Link
        href="/anggota"
        className="inline-flex items-center gap-1.5 text-sm mb-4 sm:mb-6 hover:underline"
        style={{
          fontFamily: "var(--font-elms-sans), sans-serif",
          color: "var(--on-surface-variant)",
        }}
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Direktori
      </Link>

      {/* ==================== PROFILE HEADER ==================== */}
      <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8 mb-8 sm:mb-12">
        {/* Profile Image */}
        <div className="shrink-0">
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full border-2"
              style={{ borderColor: "var(--gold-accent)" }}
            />
            <Avatar className="h-32 w-32 sm:h-48 sm:w-48 border-3 border-transparent rounded-full">
              <AvatarImage src={member.photoUrl || undefined} />
              <AvatarFallback
                className="text-4xl sm:text-5xl"
                style={{
                  backgroundColor: member.isAlive
                    ? "var(--primary-container)"
                    : "var(--surface-container-high)",
                  color: member.isAlive
                    ? "var(--on-primary-container)"
                    : "var(--on-surface-variant)",
                  fontFamily: "var(--font-noto-serif), serif",
                }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Header Content */}
        <div className="flex flex-col justify-center min-w-0">
          {/* Generation Badge */}
          <div className="flex items-center gap-1.5 mb-3">
            <Badge
              className="flex items-center gap-1.5 rounded-full border px-3 py-0.5"
              style={{
                borderColor: "var(--gold-accent)",
                backgroundColor: "transparent",
                color: "var(--ink)",
                fontFamily: "var(--font-elms-sans), sans-serif",
                fontWeight: 600,
                fontSize: "0.75rem",
              }}
            >
              <TrendingUp className="h-3 w-3" />
              {generationBadge} GENERATION
            </Badge>
          </div>

          {/* Full Name */}
          <h1
            className="font-serif font-bold mb-1"
            style={{
              fontFamily: "var(--font-noto-serif), serif",
              color: "var(--ink)",
              fontSize: "clamp(1.75rem, 5vw, 3rem)",
              lineHeight: "1.2",
              letterSpacing: "-0.02em",
            }}
          >
            {member.fullName}
          </h1>

          {/* Nickname */}
          {member.nickname && (
            <p
              className="text-lg sm:text-xl"
              style={{
                fontFamily: "var(--font-noto-serif), serif",
                color: "var(--on-surface-variant)",
                fontStyle: "italic",
              }}
            >
              &ldquo;{member.nickname}&rdquo;
            </p>
          )}
        </div>
      </div>

      {/* ==================== MAIN BODY GRID ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
        {/* ---- LEFT: Ledger Entries ---- */}
        <aside className="lg:col-span-1">
          <Card className="border-[var(--ledger-line)] bg-[var(--surface-container-lowest)] shadow-heritage">
            <CardHeader className="pb-3">
              <CardTitle
                className="font-serif font-bold flex items-center gap-2 text-lg"
                style={{
                  fontFamily: "var(--font-noto-serif), serif",
                  color: "var(--ink)",
                }}
              >
                <BookOpen className="h-5 w-5" />
                Catatan Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              {/* Born */}
              <LedgerRow icon={Gift} label="Lahir">
                {member.birthDate ? formatDate(member.birthDate) : "-"}
              </LedgerRow>

              {/* Birth Place */}
              {member.birthPlace && (
                <LedgerRow icon={MapPin} label="Tempat Lahir">
                  {member.birthPlace}
                </LedgerRow>
              )}

              {/* Died */}
              {member.deathDate && (
                <LedgerRow icon={Hourglass} label="Wafat">
                  {formatDate(member.deathDate)}
                  {age !== null && (
                    <span style={{ color: "var(--on-surface-variant)" }}>
                      {" "}
                      (Usia {age})
                    </span>
                  )}
                </LedgerRow>
              )}

              {/* Death Place */}
              {member.deathPlace && (
                <LedgerRow icon={MapPin} label="Tempat Wafat">
                  {member.deathPlace}
                </LedgerRow>
              )}

              {/* Is Alive indicator when no death date */}
              {!member.deathDate && member.isAlive && (
                <LedgerRow icon={Heart} label="Status">
                  <span style={{ color: "var(--primary)" }}>Hidup</span>
                </LedgerRow>
              )}

              {/* Occupation */}
              {member.occupation && (
                <LedgerRow icon={Briefcase} label="Pekerjaan">
                  {member.occupation}
                </LedgerRow>
              )}

              {/* Religion */}
              {member.religion && (
                <LedgerRow icon={Moon} label="Agama">
                  {member.religion}
                </LedgerRow>
              )}

              {/* Address */}
              {member.address && (
                <LedgerRow icon={MapPin} label="Alamat" noTruncate>
                  {member.address}
                </LedgerRow>
              )}
            </CardContent>
          </Card>
        </aside>

        {/* ---- RIGHT: Life Chronicle ---- */}
        <main className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <h2
              className="font-serif font-bold text-2xl shrink-0"
              style={{
                fontFamily: "var(--font-noto-serif), serif",
                color: "var(--ink)",
              }}
            >
              Biografi
            </h2>
            <div className="flex-1">
              <div className="gold-line" />
            </div>
          </div>

          {bioParagraphs.length > 0 ? (
            <div
              className="space-y-4 text-base leading-relaxed"
              style={{
                fontFamily: "var(--font-noto-serif), serif",
                color: "#4A3F35",
              }}
            >
              {bioParagraphs.map((paragraph, idx) => (
                <p
                  key={idx}
                  className={
                    idx === 0
                      ? "first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:leading-[0.85] first-letter:pt-0.5"
                      : ""
                  }
                  style={{
                    ...(idx === 0 && { ["--ink" as string]: "var(--ink)" }),
                    color: "#4A3F35",
                  }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            <div
              className="text-center py-16 border border-dashed border-[var(--outline-variant)] rounded-lg"
              style={{
                fontFamily: "var(--font-elms-sans), sans-serif",
                color: "var(--on-surface-variant)",
              }}
            >
              <p className="text-lg">Belum ada biografi.</p>
              <p className="text-sm mt-1">
                Data akan ditambahkan oleh pengurus arsip.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* ==================== KINSHIP SECTION ==================== */}
      {(member.parents.length > 0 ||
        member.siblings.length > 0 ||
        member.spouses.length > 0 ||
        member.children.length > 0) && (
        <section className="mb-12 sm:mb-16">
          <div className="gold-line mb-8" />

          <div className="mb-6">
            <h2
              className="font-serif font-bold text-2xl mb-2"
              style={{
                fontFamily: "var(--font-noto-serif), serif",
                color: "var(--ink)",
              }}
            >
              Hubungan Keluarga
            </h2>
            <div className="gold-line" style={{ maxWidth: "120px" }} />
          </div>

          {/* Parents */}
          {member.parents.length > 0 && (
            <div className="mb-8">
              <h3
                className="text-xs font-bold tracking-wider mb-4"
                style={{
                  fontFamily: "var(--font-elms-sans), sans-serif",
                  color: "var(--ink)",
                }}
              >
                | ORANG TUA
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {member.parents.map((parent) => (
                  <KinshipCard key={parent.id} member={parent} />
                ))}
              </div>
            </div>
          )}

          {/* Siblings */}
          {member.siblings.length > 0 && (
            <div className="mb-8">
              <h3
                className="text-xs font-bold tracking-wider mb-4"
                style={{
                  fontFamily: "var(--font-elms-sans), sans-serif",
                  color: "var(--ink)",
                }}
              >
                | SAUDARA
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {member.siblings.map((sibling) => (
                  <KinshipCard key={sibling.id} member={sibling} />
                ))}
              </div>
            </div>
          )}

          {/* Spouses */}
          {member.spouses.length > 0 && (
            <div className="mb-8">
              <h3
                className="text-xs font-bold tracking-wider mb-4"
                style={{
                  fontFamily: "var(--font-elms-sans), sans-serif",
                  color: "var(--ink)",
                }}
              >
                | PASANGAN
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {member.spouses.map((spouse) => (
                  <KinshipCard key={spouse.id} member={spouse} />
                ))}
              </div>
            </div>
          )}

          {/* Children */}
          {member.children.length > 0 && (
            <div className="mb-8">
              <h3
                className="text-xs font-bold tracking-wider mb-4"
                style={{
                  fontFamily: "var(--font-elms-sans), sans-serif",
                  color: "var(--ink)",
                }}
              >
                | ANAK
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...member.children]
                  .sort((a, b) => {
                    if (!a.birthDate) return 1;
                    if (!b.birthDate) return -1;
                    return (
                      new Date(a.birthDate).getTime() -
                      new Date(b.birthDate).getTime()
                    );
                  })
                  .map((child) => (
                    <KinshipCard key={child.id} member={child} />
                  ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

/* ─────────── Sub-components ─────────── */

function LedgerRow({
  icon: Icon,
  label,
  children,
  noTruncate,
}: {
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  label: string;
  children: React.ReactNode;
  noTruncate?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-3 py-3 border-b border-[var(--ledger-line)] last:border-b-0"
      style={{ fontFamily: "var(--font-elms-sans), sans-serif" }}
    >
      <Icon
        className="h-4 w-4 shrink-0"
        style={{ color: "var(--on-surface-variant)" }}
      />
      <span
        className="text-xs font-semibold uppercase tracking-wider shrink-0 w-28"
        style={{ color: "var(--ink)", opacity: 0.7 }}
      >
        {label}
      </span>
      <span className={cn("text-sm text-[var(--on-surface)] font-medium ml-auto text-right", !noTruncate && "truncate")}>
        {children}
      </span>
    </div>
  );
}

function KinshipCard({
  member,
}: {
  member: MemberWithRelations["parents"][number];
}) {
  const initials = getInitials(member.fullName);
  const yearSpan = getYearSpan(member);

  return (
    <Link href={`/anggota/${member.slug}`}>
      <Card className="!flex-row items-center gap-4 p-4 hover:shadow-heritage-lg transition-all duration-300 ease-out hover:-translate-y-0.5 cursor-pointer group border-[var(--ledger-line)] bg-[var(--surface-container-lowest)] shadow-heritage">
        <div className="relative shrink-0">
          <div
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: "var(--ink)" }}
          />
          <Avatar className="h-14 w-14 border-3 border-transparent rounded-full">
            <AvatarImage src={member.photoUrl || undefined} />
            <AvatarFallback
              className="text-base"
              style={{
                backgroundColor: member.isAlive
                  ? "var(--primary-container)"
                  : "var(--surface-container-high)",
                color: member.isAlive
                  ? "var(--on-primary-container)"
                  : "var(--on-surface-variant)",
                fontFamily: "var(--font-noto-serif), serif",
              }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="min-w-0 flex-1">
          <h4
            className="font-serif font-bold text-base truncate group-hover:text-[var(--primary)] transition-colors"
            style={{
              fontFamily: "var(--font-noto-serif), serif",
              color: "var(--ink)",
            }}
          >
            {member.fullName}
          </h4>
          {yearSpan && (
            <p
              className="text-sm mt-0.5"
              style={{
                fontFamily: "var(--font-elms-sans), sans-serif",
                color: "var(--on-surface-variant)",
              }}
            >
              {yearSpan}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}
