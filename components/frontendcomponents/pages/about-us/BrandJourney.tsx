"use client";
import { useState } from "react";

export default function BrandJourney({ data, id }: any) {
  if (!data) return null;
  const [selected, setSelected] = useState(0);
  return (
    <section>
      <div className="journey_sec sec-pad-all light-bg" id={id}>
        <div className="container">
          <div className="heading">
            <h2>Our Brand Journey</h2>
          </div>
          <div className="main_wrapper">
            <div className="timeline">
              {data.map(({ MilestoneYear, Title, Description }: any, index: number) => (
                <div className="time_col" key={index}>
                  <input
                    type="radio"
                    name="timeline"
                    id={index as any}
                    checked={selected === index}
                    onChange={() => setSelected(index)}
                  />
                  <div className="time-item">
                    <label htmlFor={index as any} className="year">
                      {MilestoneYear}
                    </label>
                    <span
                      className="dot"
                      onClick={() => setSelected(index)}
                      style={{ cursor: "pointer" }}
                    />
                    <div className="content">
                      <h4>{Title}</h4>
                      <p dangerouslySetInnerHTML={{ __html: Description }}></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
