const Loader = ({ size = 20 }: { size?: number }) => {
  return (
    <img
      src="/icons/loader-2.svg"
      className="text-white animate-spin"
      width={size}
      height={size}
    />
  );
};

export default Loader;
