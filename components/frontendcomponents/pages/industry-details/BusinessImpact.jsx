import React from "react";

function BusinessImpact({ data, id }) {
  if (!data) return null;

  return (
    <section>
      <div className="business_sec sec-pad-all" id={id}>
        <div className="container">
          <div className="heading">
            <h2>{data.heading}</h2>
          </div>
          <div className="grid">
            {data?.ImpactCard?.map((item, index) => (
              <div key={item?.id} className="card">
                <h2>{item.value}</h2>
                <p>{item.valueName}</p>
                <span>{item.valueDetail}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default BusinessImpact;
