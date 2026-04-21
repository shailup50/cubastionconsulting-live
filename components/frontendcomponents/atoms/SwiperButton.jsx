export default function SwiperButton({ classname = "", onClick }) {
  return (
    <button className={classname} onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20px"
        height="20px"
        viewBox="0 0 24 24"
      >
        <path
          fill="none"
          stroke="#000"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="m9 6l6 6l-6 6"
        />
      </svg>
    </button>
  );
}