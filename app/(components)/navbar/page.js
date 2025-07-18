import Link from "next/link";

export default function NavbarPage() {
  return (
    <header style={{backgroundColor:"#471396"}} className="flex items-center justify-between text-white">
        <Link href="/" className="ml-5">File Convert</Link>
        <nav className="flex justify-end items-center">
            <ul className="flex space-x-4 p-4">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/convert">Convert</Link></li>
                <li><Link href="/about">About</Link></li>
            </ul>
        </nav>
    </header>
  );
}