import React from "react";
import Image from "next/image";
import Button from "@/components/frontendcomponents/atoms/Button";
import Link from "next/link";


function BlogCard({ data }) {

  if (!data) return null;
  
  return (
    <Link href={`/blogs/${data?.href}`} className="blog_card" >
      {data?.bgmedia && (
        <div className="blog_img">
          <Image src={data.bgmedia} width={650} height={450} alt="card" />
        </div>
      )}
      <div className="blog_content">
        {data?.date && <p>{data.date}</p>}
        {data?.heading && <h6>{data.heading}</h6>}
        <div className="btns">
          {
            data?.tags?.map((item, index) => (
              <span className="tags" key={index}>{item?.name}</span>
            ))
          }
        </div>
      </div>
    </Link>
  );
}

export default BlogCard;
