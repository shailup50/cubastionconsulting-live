"use client"
import Link from "next/link";
import { useState, useEffect, useRef } from "react"

export default function CaseNavigation({ data, id }){
    if(!data) return null;
    const [activeId, setActiveId] = useState(1);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const caseNavRef = useRef(null);
    const sectionWrapRef = useRef(null);

    const handleNavClick = (id) => {
        setActiveId(id);
        const element = document.getElementById(id);
        if (element) {
            const offset = 180;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
        }
    };

    const handleBackToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        const handleScroll = () => {
            const header = document.querySelector('header');
            if (caseNavRef.current && header) {
                const navRect = caseNavRef.current.getBoundingClientRect();
                const computedStyle = window.getComputedStyle(caseNavRef.current);
                const stickyTop = parseFloat(computedStyle.top) || 0;
                const isNavSticky = navRect.top <= stickyTop;
                
                const sectionWrapRect = sectionWrapRef.current?.getBoundingClientRect();
                const isWithinSections = sectionWrapRect ? sectionWrapRect.bottom > 0 : true;
                
                if (isNavSticky && isWithinSections) {
                    header.classList.add('no_shadow');
                } else {
                    header.classList.remove('no_shadow');
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
      <div className="case_navigation sec-pad-all" id={id}>
        <div className="container scroll_wrap">
          <div className="main_wrapper">
            <h6>{data.heading}</h6>
            <nav>
              {data.navData.map((item) => (
                <div
                  className="nav_item"
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                >
                  <p>{item.navitem}</p>
                  <button type="button">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20px"
                      height="20px"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#00000066"
                        fillRule="evenodd"
                        d="M12.013 2.25a.75.75 0 0 1 .75.75l-.012 16.19l5.72-5.708a.75.75 0 1 1 1.059 1.061l-7 6.988a.75.75 0 0 1-1.06 0l-7-6.988a.75.75 0 0 1 1.06-1.061l5.721 5.71L11.262 3a.75.75 0 0 1 .751-.75"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </div>
              ))}
            </nav>
          </div>
        </div>
        <nav className="case_nav" ref={caseNavRef}>
          <div className="container">
            <div className="nav_wrapper">
              <ul>
                {data.navData.map((item) => (
                  <li
                    key={item.id}
                    className={activeId === item.id ? "active" : ""}
                    onClick={() => handleNavClick(item.id)}
                  >
                    {item.navitem}
                  </li>
                ))}
              </ul>
              <div className="cta_wrap">
                <div className="share_wrap">
                  <button type="button" className="shareBtn" onClick={() => setIsShareOpen(!isShareOpen)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20px"
                      height="20px"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#00000066"
                        d="M16.61 21q-.994 0-1.687-.695q-.692-.696-.692-1.69q0-.15.132-.757l-7.197-4.273q-.324.374-.793.587t-1.007.213q-.986 0-1.676-.702T3 12t.69-1.683t1.676-.702q.537 0 1.007.213t.793.588l7.198-4.255q-.07-.194-.101-.385q-.032-.192-.032-.392q0-.993.697-1.689Q15.625 3 16.62 3t1.688.697T19 5.389t-.695 1.688t-1.69.692q-.542 0-1-.222t-.78-.597l-7.199 4.273q.07.194.101.386q.032.191.032.391t-.032.391t-.1.386l7.198 4.273q.323-.375.78-.597q.458-.222 1-.222q.994 0 1.69.696q.695.698.695 1.693t-.697 1.688t-1.692.692m.004-1q.589 0 .987-.398t.398-.986t-.398-.987t-.986-.398t-.987.398t-.398.986t.398.987t.987.398m-11.25-6.616q.596 0 1-.402q.403-.403.403-.982t-.403-.982t-1-.403q-.581 0-.973.403Q4 11.421 4 12t.393.982t.973.403M17.597 6.37Q18 5.973 18 5.384q0-.588-.398-.986T16.616 4t-.987.398t-.398.987t.403.986t.982.398t.981-.398m-.981-.987"
                      ></path>
                    </svg>
                  </button>
                  <ul className={`share_options ${isShareOpen ? 'open' : ''}`}>
                    <li>
                      <Link href="">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="#666"
                            d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4z"
                          />
                        </svg>
                      </Link>
                    </li>
                    <li>
                      <Link href="">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={24}
                          height={24}
                          viewBox="0 0 14 14"
                        >
                          <g fill="none">
                            <g clipPath="url(#primeTwitter0)">
                              <path
                                fill="#666"
                                d="M11.025.656h2.147L8.482 6.03L14 13.344H9.68L6.294 8.909l-3.87 4.435H.275l5.016-5.75L0 .657h4.43L7.486 4.71zm-.755 11.4h1.19L3.78 1.877H2.504z"
                              />
                            </g>
                            <defs>
                              <clipPath id="primeTwitter0">
                                <path fill="#666" d="M0 0h14v14H0z" />
                              </clipPath>
                            </defs>
                          </g>
                        </svg>
                      </Link>
                    </li>
                    <li>
                      <Link href="">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="#666"
                            d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01m-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23m4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.19-.54.06c-.25-.12-1.05-.39-1.99-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.14-.25-.02-.38.11-.51c.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31c-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52c.59.19 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28"
                          ></path>
                        </svg>
                      </Link>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  className="back_to_top"
                  onClick={handleBackToTop}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20px"
                    height="20px"
                    viewBox="0 0 32 32"
                  >
                    <path
                      fill="none"
                      stroke="#00000066"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="m6 10l10-8l10 8M16 2v28"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>
        <div className="container section_wrap" ref={sectionWrapRef}>
          {data.navData.map((item) => (
            <section key={item.id} id={item.id}>
              <div className="heading">
                <h2>{item.heading}</h2>
                <h6>{item.subheading}</h6>
              </div>
              <div
                className="content"
                dangerouslySetInnerHTML={{ __html: item.content }}
              ></div>
            </section>
          ))}
        </div>
      </div>
    );
}