import Image from 'next/image';
import { Developer } from '@/types';

interface DeveloperCardProps {
  developer: Developer;
  onBook: (developerId: string) => void;
}

export default function DeveloperCard({ developer, onBook }: DeveloperCardProps) {
  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md flex flex-col justify-between">
     
     
<div className='flex justify-between'>
      <div className="flex items-center justify-between">
        <Image
          src={developer.user.image}
          alt={`${developer.user.name}'s profile picture`}
          width={60}
          height={60}
          className="rounded-full"
        />
        <div className="ml-4">
          <h2 className="text-xl font-semibold">{developer.user.name}</h2>
          <p className="text-sm text-gray-400">{developer.bio}</p>
        </div>
      </div>

      <button
        className={`mt-6 py-2 w-28 rounded font-semibold ${
          developer.availability
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-gray-600 cursor-not-allowed'
        }`}
        disabled={!developer.availability}
        onClick={() => onBook(developer.id)}
      >
        {developer.availability ? 'Book a Call' : 'Not Available'}
      </button>


</div>


      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          <a
            href={developer.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-700 px-3 py-1 rounded text-sm text-blue-400 hover:underline"
          >
            Portfolio
          </a>
          <a
            href={developer.github}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-700 px-3 py-1 rounded text-sm text-blue-400 hover:underline"
          >
            GitHub
          </a>
        </div>

        <div className="mt-4 flex flex-row gap-4">
          <p className="bg-gray-700 px-3 py-2 rounded text-sm">
            {/* <span className="font-semibold">Technologies:</span>{' '} */}
            {developer.technologies.filter(Boolean).join(', ')}
          </p>
          <p className="bg-gray-700 px-3 py-2 rounded text-sm mt-2">
            <span className="font-semibold">Hourly Rate:</span> ${developer.hourlyRate}/hr
          </p>
        </div>
      </div>

     
    </div>
  );
}
