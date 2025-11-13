import { useState } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { Link } from "react-router-dom"; // ✅ Correct import
import profilePic from "../../Asserts/avishek-sir-pic.webp"; // ✅ Proper image import

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="relative">
      {/* Dropdown Toggle */}
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        {/* ✅ Proper imported image */}
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <img
            src={profilePic}
            alt="Admin Profile"
            className="object-cover w-full h-full"
          />
        </span>

        <span className="block mr-1 font-medium text-theme-sm">
          Admin@ Team Uru
        </span>

        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        {/* Header Info */}
        <div>
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            Admin@Team Uru
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            uruonline2025@gmail.com
          </span>
        </div>

        {/* Options */}
        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <svg
                className="fill-gray-500 group-hover:fill-gray-700 dark:fill-gray-400 dark:group-hover:fill-gray-300"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 3.5C7.3 3.5 3.5 7.3 3.5 12C3.5 14.15 4.3 16.12 5.62 17.62C6.17 15.31 8.25 13.6 10.72 13.6H13.27C15.75 13.6 17.83 15.31 18.38 17.62C19.7 16.12 20.5 14.15 20.5 12C20.5 7.3 16.7 3.5 12 3.5Z"
                />
              </svg>
              Edit Profile
            </DropdownItem>
          </li>

          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/support"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <svg
                className="fill-gray-500 group-hover:fill-gray-700 dark:fill-gray-400 dark:group-hover:fill-gray-300"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.1 7.53C11.1 8.02 11.5 8.43 12 8.43C12.5 8.43 12.9 8.02 12.9 7.53C12.9 7.03 12.5 6.63 12 6.63C11.5 6.63 11.1 7.03 11.1 7.53ZM12 17.37C11.59 17.37 11.25 17.04 11.25 16.62V10.94C11.25 10.53 11.59 10.19 12 10.19C12.41 10.19 12.75 10.53 12.75 10.94V16.62C12.75 17.04 12.41 17.37 12 17.37Z"
                />
              </svg>
              Support
            </DropdownItem>
          </li>
        </ul>

        {/* Logout */}
        <Link
          to="/signin"
          onClick={closeDropdown}
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        >
          <svg
            className="fill-gray-500 group-hover:fill-gray-700 dark:group-hover:fill-gray-300"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.25 12C3.25 12.21 3.34 12.41 3.49 12.55L8.09 17.16C8.39 17.45 8.86 17.45 9.16 17.16C9.45 16.86 9.45 16.39 9.16 16.1L5.81 12.75H16C16.41 12.75 16.75 12.41 16.75 12C16.75 11.58 16.41 11.25 16 11.25H5.81L9.16 7.9C9.45 7.61 9.45 7.14 9.16 6.84C8.86 6.55 8.39 6.55 8.09 6.84L3.52 11.42C3.36 11.56 3.25 11.76 3.25 12Z"
            />
          </svg>
          Sign Out
        </Link>
      </Dropdown>
    </div>
  );
}
