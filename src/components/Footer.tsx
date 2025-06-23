import { getCurrentYear } from "../utils/date_stuff";

export const Footer = () => {
  return (
    <div className="text-sm flex items-center justify-between px-6 md:px-8 py-5 border-t border-dark-grey">
      <p>Tom Scelsi © {getCurrentYear()}</p>
      <div className="flex gap-4">
        {/* <p>soundcloud</p> */}
      </div>
    </div>
  );
};
