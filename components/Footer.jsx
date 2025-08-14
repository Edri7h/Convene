export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-800 bg-[#0B0B0F] py-8 mt-16">
      <div className="container mx-auto px-4 text-center text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} Ehtesham Nawaz. All rights reserved.</p>
        {/* Or, if you prefer to use the app name: */}
        {/* <p>&copy; {new Date().getFullYear()} BookWithMe. All rights reserved.</p> */}
      </div>
    </footer>
  );
}
