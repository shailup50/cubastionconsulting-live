import Link from "next/link";

export default function Button({ classname="", linkHref="", buttonText="", onClick, ...rest }){
    const isLink = Boolean(linkHref);
    const Component = isLink ? Link : "button";
    const componentProps = {
        className: `btn ${classname}`,
        onClick: !isLink ? onClick : undefined,
        ...(isLink ? { href: linkHref } : { type: "button" }),
        ...rest,
    };
    return(
        <Component {...componentProps}>
            {buttonText}
            <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 1024 1024">
                <path fill="currentColor" d="M768 256H353.6a32 32 0 1 1 0-64H800a32 32 0 0 1 32 32v448a32 32 0 0 1-64 0z"></path>
                <path fill="currentColor" d="M777.3 201.3a32 32 0 0 1 45.4 45.4l-544 544a32 32 0 0 1-45.4-45.4z"></path>
            </svg>
        </Component>
    )
}