import Button from "@/components/frontendcomponents/atoms/Button";
import HeartAnimation from "../../animation/HeartAnimation";
import AutomotiveAnimation from "../../animation/AutomotiveAnimation";
import AppliancesAnimation from "../../animation/AppliancesAnimation";
import PublicAnimation from "../../animation/PublicAnimation";
import FinancialAnimation from "../../animation/FinancialAnimation";
import ConnectedAnimation from "../../animation/ConnectedAnimation";
import TelecomAnimation from "../../animation/TelecomAnimation";

function HeroSection({ data, id }: any) {
  if (!data) return null;
  return (
    <section>
      <div className="industry-banner" id={id}>
        <div className="container">
          <div className="grid">
            <div className="item-content heading">
              <p className="name">{data.name}</p>
              <h1>{data.heading}</h1>
              <p>{data.subheading}</p>
              <Button classname="bottom-arrow" buttonText="See What We Do" />
            </div>
            <div className="item-media">
              <figure className={(data.name?.toLowerCase().split(' ')[0]) || ''}>
                {
                  data.name === "Automotive" ? ( 
                    <AutomotiveAnimation id="1" /> 
                  ) : data.name === "Telecom" ? (
                    <TelecomAnimation />
                  ) : data.name === "Home Appliances" ? (
                    <AppliancesAnimation />
                  ) : data.name === "Public Services" ? (
                    <PublicAnimation />
                  ) : data.name === "Financial Services" ? (
                    <FinancialAnimation />
                  ) : data.name === "Connected Devices" ? (
                    <ConnectedAnimation />
                  ) : (
                    <HeartAnimation />
                  )
                }
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
