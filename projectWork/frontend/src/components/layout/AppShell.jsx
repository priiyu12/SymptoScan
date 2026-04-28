export default function AppShell({ children, className = "" }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
        {children}
      </div>
    </div>
  );
}