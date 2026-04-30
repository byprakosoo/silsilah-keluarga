export function PublicFooter() {
  return (
    <footer className="border-t border-[var(--ledger-line)] bg-[var(--surface)] py-6 mt-auto">
      <div className="max-w-[var(--container-max)] mx-auto px-[var(--gutter)] text-center">
        <p className="text-sm text-[var(--on-surface-variant)]" style={{ fontFamily: "var(--font-noto-serif), serif" }}>
          Dibuat dengan cinta untuk keluarga besar.
        </p>
        <p className="text-xs text-[var(--on-surface-variant)] mt-1" style={{ fontFamily: "var(--font-source-sans), sans-serif" }}>
          Kelola silsilah:{" "}
          <a href="/admin/login" className="underline hover:text-[var(--primary)]">
            Admin Login
          </a>
        </p>
      </div>
    </footer>
  )
}
