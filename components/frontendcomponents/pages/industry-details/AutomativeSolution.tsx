import React from "react";
import Card from "@/components/frontendcomponents/atoms/Card";

function AutomativeSolution({ data, id }: any) {
  if (!data) return null;

  return (
    <section>
      <div className="automation_sec sec-pad-all" id={id}>
        <div className="container">
          <div className="heading">
            <h2>{data.heading}</h2>
            <p>{data.subheading}</p>
          </div>
          <div className="grid">
            {data.SolutionsCard.map((item: any) => (
              <Card key={item.id} data={item} variant={"case"} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AutomativeSolution;
