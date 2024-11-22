'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const HomePage = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  const handleNavigate = () => {
    router.push('/about/Categories');
  };
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div>  {}
        <div className="relative z-index-1000 overflow-hidden bg-white">
          <div className="pb-80 pt-16 sm:pb-40 sm:pt-24 lg:pb-48 lg:pt-40">
            <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
              <div className="sm:max-w-lg">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  Summer styles are finally here
                </h1>
                <p className="mt-4 text-xl text-gray-500">
                  This year, our new summer collection will shelter you from the harsh elements of a world that does not care
                  if you live or die.
                </p>
              </div>
              <div className="mt-10">
                {/* Decorative image grid */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl"
                >
                  <div className="absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                    <div className="flex items-center space-x-6 lg:space-x-8">
                      <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                        <div className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100">
                          <Image
                            alt=""
                            src="/images/woman.jpg"
                            className="h-full w-full object-cover object-center"
                             width={500} 
                            height={500}
                          />
                        </div>
                        <div className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100">
                          <Image
                            alt=""
                            src="/images/krasnyi_cardigan.jpg"
                            className="h-full w-full object-cover object-center"
                            width={500} 
                            height={500}
                          />
                        </div>
                      </div>
                      {/* More image sections here */}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleNavigate}
                  className="inline-block rounded-md border border-transparent bg-[#98730C] px-8 py-3 text-center font-medium text-white hover:bg-[#f0bd7a]"
                >
                    <span>Shop Collection</span>
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>  
  );
};

export default HomePage;
