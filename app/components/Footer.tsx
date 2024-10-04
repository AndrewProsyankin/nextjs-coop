
import Link from "next/link";
const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white p-5 flex flex-col space-y-5 space-y-5">
            <Link href="/589">FAQ</Link>
            <Link href="/1">Confidentiality</Link>
            <Link href="/2">Deliveries</Link>
            <Link href="/about">About Us</Link>
            <p>© 2024 My Website</p>
        </footer>
        
    );
  };
  
  export default Footer;


  