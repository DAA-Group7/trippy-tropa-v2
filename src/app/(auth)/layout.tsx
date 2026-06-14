export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen relative p-4">
      <div className="blob top-[-10%] left-[-10%]"></div>
      <div className="blob bottom-[-10%] right-[-10%] bg-gradient-to-t from-secondary/40 to-transparent"></div>
      
      {/* Background blobs are handled in CSS */}
      <main className="w-full max-w-[480px] z-10">
        {children}
      </main>
    </div>
  );
}
