export default function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.08)] py-6 md:py-8">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-[#8888aa] text-xs md:text-sm">
          Built with Next.js, Supabase & Framer Motion
        </p>
        <p className="text-[#8888aa] text-[10px] md:text-xs mt-2">
          &copy; {new Date().getFullYear()} Ramdan Suwandi. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
