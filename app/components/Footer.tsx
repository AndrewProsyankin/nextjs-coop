
import Link from "next/link";
const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white p-4 flex flex-col space-x-4">
            <Link href="/0">Q&A</Link>
            <Link href="/1">Confidentionality</Link>
            <Link href="/2">Deliveries</Link>
            <Link href="/about">About Us</Link>
            <p>© 2024 My Website</p>
      </footer>
    );
  };
  
  export default Footer;


  