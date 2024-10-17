import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-6 flex flex-col space-y-4">
      <Link href="/589" className="ml-4">
        FAQ
      </Link>
      <Link href="/1" className="ml-4">
        Confidentiality
      </Link>
      <Link href="/2" className="ml-4">
        Deliveries
      </Link>
      <Link href="/about" className="ml-4">
        About Us
      </Link>
      <p className="text-center">© 2024 Store nA dIvAnE. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
