
import Image from "next/image";
import Link from "next/link";


const Footer = () => {
  return (
    <footer className="bg-[#6E4C1EFF] text-white p-6 flex flex-col space-y-4">
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
      <Image
        alt=""
        src="/images/neurobilan.jpg"
        className="h-20 w-20 mx-auto rounded-lg"
        width={80}
        height={80}
      />
      <p className="text-center">
        <span>© NEUROBILAN 2024</span>
        <br />
        <span>All rights reserved.</span>
      </p>
    </footer>
  );
};

export default Footer;
