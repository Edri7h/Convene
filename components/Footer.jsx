export default function Footer() {
  return (
    <footer className="w-full border-t py-6 mt-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Ehtesham Nawaz. All rights reserved.
      </div>
    </footer>
  );
}
