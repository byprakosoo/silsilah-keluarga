export function PublicFooter() {
  return (
    <footer className="border-t border-[var(--ledger-line)] bg-[var(--surface)] mt-auto">
      <div className="max-w-[var(--container-max)] mx-auto px-[var(--gutter)] py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p
          className="text-sm"
          style={{
            fontFamily: "var(--font-noto-serif), serif",
            color: "var(--on-surface-variant)",
          }}
        >
          &copy; {new Date().getFullYear()} Silsilah Keluarga. Dilestarikan untuk generasi mendatang.
        </p>
        <div
          className="flex items-center gap-5 text-sm"
          style={{
            fontFamily: "var(--font-noto-serif), serif",
            color: "var(--on-surface-variant)",
          }}
        >
          <span>Kebijakan Privasi</span>
          <span>Ketentuan Arsip</span>
          <span>Hubungi Pengurus</span>
        </div>
      </div>
    </footer>
  )
}
