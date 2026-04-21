import React from 'react'
import Image from 'next/image';
import Link from 'next/link';

function CareerCard({ data }) {         

  if (!data) return null;

  return (
    <div className='career_card'>
        <span>{data.heading}</span>
        <p>{data.role}</p>
        <ul>
          {data.locations?.map((item) => (
            <li key={item.id}>          
              <Image
                src={item.icon}
                width={24}
                height={24}
                alt={item.locate}       
              />
              <p>{item.locate}</p>
            </li>
          ))}
        </ul>
        <Link className="btn primary-border" href="">
          Explore
          <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 1024 1024">
            <path fill="currentColor" d="M768 256H353.6a32 32 0 1 1 0-64H800a32 32 0 0 1 32 32v448a32 32 0 0 1-64 0z" />
            <path fill="currentColor" d="M777.3 201.3a32 32 0 0 1 45.4 45.4l-544 544a32 32 0 0 1-45.4-45.4z" />
          </svg>
        </Link>
    </div>
  )
}

export default CareerCard