import React from "react";
import Image from "next/image";
import Button from "@/components/frontendcomponents/atoms/Button";
import "@/uploads/styles/component/component.css"
import Link from "next/link";

function Card({ variant, data }) {
  if (!data) return null;

  return (
    <Link href={data?.link || "#"} className={`card ${variant ? `card-${variant}` : ""}`}>
      {data?.bgmedia && (
        <div className="card-img">
          <Image src={data.bgmedia} width={650} height={450} alt="card" />
        </div>
      )}
      <div className="card-content">
        {data?.heading && <h6>{data.heading}</h6>}
        {data?.subheading && <p>{data.subheading}</p>}
        {variant === "btn" && data?.buttonText && (
          <Button linkHref="" buttonText={data.buttonText} />
        )}
        {variant === "case" && data?.profile && (
          <>
            <div className="card-profile">
              <figure>
                <Image
                  src={data.profile.imgsrc}
                  width={60}
                  height={60}
                  alt="profile"
                />
              </figure>
              <figcaption>
                <h6>{data.profile.name}</h6>
                <p>{data.profile.desgn}</p>
              </figcaption>
            </div>
            <button className="tags">{data.profile.tags}</button>
          </>
        )}
      </div>
    </Link>
  );
}

export default Card;
