import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-gray-600 text-white p-4 flex justify-center items-center space-x-4">
      <Link href="/brands">Brands</Link>
      <Link href="/collection">Collection</Link>
      <Link href="/showrooms">Showrooms</Link>
      <Link href="/about">About Us</Link>
    </header>
  );
};

export default Header;
