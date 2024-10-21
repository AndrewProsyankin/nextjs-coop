'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';  


export default function CollectionsPage() {
  const router = useRouter(); 

  const handleNavigate = (href: string) => {
    router.push(href);  
  };

  const callouts = [
    {
      name: 'Desk and Office',
      description: 'Work from home accessories',
      imageSrc: '/images/office.jpg',
      imageAlt: 'Desk with leather desk pad, walnut desk organizer, wireless keyboard and mouse, and porcelain mug.',
      href: '/about/ProductPage', 
    },
    {
      name: 'Self-Improvement',
      description: 'Journals and note-taking',
      imageSrc: '/images/bloknotiki.jpg',
      imageAlt: 'Wood table with porcelain mug, leather journal, brass pen, leather key ring, and a houseplant.',
      href: '#',
    },
    {
      name: 'Travel', 
      description: 'Daily commute essentials',
      imageSrc: '/images/travel.jpg',
      imageAlt: 'Collection of four insulated travel bottles on wooden shelf.',
      href: '#',
    },
  ];

  return (
    <div>

      <div className="bg-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
            <h2 className="text-3xl font-bold text-gray-900">Collections</h2>

            <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
              {callouts.map((callout) => (
                <div key={callout.name} className="group relative">
                  <div
                    onClick={() => handleNavigate(callout.href)} 
                    className="relative h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64 cursor-pointer"
                  >
                    <Image
                      alt={callout.imageAlt}
                      src={callout.imageSrc}
                      className="h-full w-full object-cover object-center"
                      width={500} 
                      height={500}
                    />
                  </div>
                  <h3 className="mt-6 text-sm text-gray-500">
                    <a href={callout.href}>
                      <span className="absolute inset-0" />
                      {callout.name}
                    </a>
                  </h3>
                  <p className="text-base font-semibold text-gray-900">{callout.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
