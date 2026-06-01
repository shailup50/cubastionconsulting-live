"use client";
import { useModalStore } from "@/zustand/modalStore";

function ClientSucess({ data, id }: any) {
  const openVideo = useModalStore((state: any) => state.openVideo);
  if (!data) return null;

  return (
    <section>
      <div className="client_sec sec-pad-all" id={id}>
        <div className="container">
          <div className="heading">
            <h2>{data.heading}</h2>
            <p>{data.subheading}</p>
          </div>
          <div className="media">
            <video src={data.bgmedia} autoPlay muted loop playsInline></video>
            <button
              className="play"
              onClick={openVideo}
              data-video="https://www.youtube.com/embed/Uhb1l9Ma1XE?si=c7mWxUn76kq0YjIA"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path fill="currentColor" d="M8 5.14v14l11-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ClientSucess;
