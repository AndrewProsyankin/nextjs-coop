
import Link from "next/link";
const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white p-6 flex flex-col space-x-6 space-н-6">
            <Link href="/589" style={{ marginLeft: '1rem' }}>
            FAQ
            </Link>
            <Link href="/1">Confidentionality</Link>
            <Link href="/2">Deliveries</Link>
            <Link href="/about">About Us</Link>
            <p>© 2024 Store nA dIvAnE. All rights reserved.</p>
        </footer>
        
    );
  };
  
  export default Footer;


  
