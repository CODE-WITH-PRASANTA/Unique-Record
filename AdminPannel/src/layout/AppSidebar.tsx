import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

// Lucide Icons (recommended for missing ones like Trophy)
import {
  FolderPlusIcon,
  TrophyIcon,
  MessageSquareIcon,
} from "lucide-react";

// React Icons (Heroicons)
import {
  HiOutlineViewGrid as GridIcon,
  HiOutlineBookOpen as BookOpenIcon,
  HiOutlineBell as BellIcon,
  HiOutlineCalendar as CalendarIcon,
  HiOutlineUserGroup as UserGroupIcon,
  HiOutlinePhotograph as PhotographIcon,
  HiOutlineUserCircle as UserCircleIcon,
  HiOutlineFolder as FolderIcon,
  HiOutlineChatAlt2 as ChatIcon,
  HiOutlineMail as MailIcon,
  HiOutlineCurrencyRupee as RupeeIcon,
  HiChevronDown as ChevronDownIcon,
  HiOutlineDotsHorizontal as HorizontaLDots,
} from "react-icons/hi";

import { useSidebar } from "../context/SidebarContext";
import companylogo from "../Asserts/UNQUE.webp";

// Sidebar Menu Structure
const navItems = [
  { icon: <GridIcon />, name: "Dashboard", path: "/" },

  {
    icon: <BookOpenIcon />,
    name: "Manage Blogs",
    subItems: [
      { name: "Add Blog", path: "/blogs/add" },
      { name: "Preview", path: "/blogs/preview" },
    ],
  },

  {
    icon: <BellIcon />,
    name: "Notice",
    subItems: [
      { name: "Post Notice", path: "/notice/add" },
      { name: "Preview", path: "/notice/preview" },
    ],
  },

  {
    icon: <CalendarIcon />,
    name: "Event",
    subItems: [
      { name: "Add Event", path: "/event/add" },
      { name: "Preview", path: "/event/preview" },
      { name: "Register People", path: "/event/register" },
    ],
  },

  {
    icon: <UserGroupIcon />,
    name: "Team",
    subItems: [
      { name: "Team Members", path: "/team/members" },
      { name: "Preview", path: "/team/preview" },
    ],
  },

  {
    icon: <PhotographIcon />,
    name: "Media",
    subItems: [
      { name: "Post Event Photos", path: "/media/post-event" },
      { name: "YouTube Manage", path: "/media/youtube" },
      { name: "Other Photos Manage", path: "/media/other" },
    ],
  },

  {
    icon: <UserCircleIcon />,
    name: "URU Manage",
    subItems: [
      { name: "Manage URU", path: "/uru/manage" },
      { name: "Approve URU", path: "/uru/approve" },
      { name: "Final URU", path: "/uru/final" },
    ],
  },

  {
    icon: <TrophyIcon className="w-5 h-5" />,
    name: "Achievements",
    subItems: [
      { name: "Add Achievement", path: "/achievements/add" },
      { name: "Preview", path: "/achievements/preview" },
    ],
  },

  { icon: <FolderIcon />, name: "Manage Category", path: "/category/manage" },

  {
    icon: <ChatIcon />,
    name: "Testimonial",
    subItems: [
      { name: "User Testimonial", path: "/testimonial/user" },
      { name: "Blog Comment", path: "/testimonial/comment" },
    ],
  },

  { icon: <MailIcon />, name: "Contact Managements", path: "/contact/managements" },
  { icon: <MailIcon />, name: "User Opinion", path: "/user/opinion" },
  { icon: <MailIcon />, name: "Subscribe Letter", path: "/subscribe-letter" },
  { icon: <RupeeIcon />, name: "Donation Manage", path: "/donation/manage" },
];

const AppSidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{ index: number } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<number, number>>({});
  const subMenuRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let matched = false;
    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((sub) => {
          if (isActive(sub.path)) {
            setOpenSubmenu({ index });
            matched = true;
          }
        });
      }
    });
    if (!matched) setOpenSubmenu(null);
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = openSubmenu.index;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prev) => (prev?.index === index ? null : { index }));
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* LOGO */}
      <div
        className={`py-5 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          <img
            src={companylogo}
            alt="Company Logo"
            width={isExpanded || isHovered || isMobileOpen ? 150 : 32}
            height={isExpanded || isHovered || isMobileOpen ? 40 : 32}
          />
        </Link>
      </div>

      {/* MENU */}
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav>
          <h2
            className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
              !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
            }`}
          >
            {isExpanded || isHovered || isMobileOpen ? (
              "Main Menu"
            ) : (
              <HorizontaLDots className="size-6" />
            )}
          </h2>

          <ul className="flex flex-col gap-4">
            {navItems.map((nav, index) => (
              <li key={nav.name}>
                {nav.subItems ? (
                  <button
                    onClick={() => handleSubmenuToggle(index)}
                    className={`menu-item group ${
                      openSubmenu?.index === index
                        ? "menu-item-active"
                        : "menu-item-inactive"
                    } cursor-pointer ${
                      !isExpanded && !isHovered
                        ? "lg:justify-center"
                        : "lg:justify-start"
                    }`}
                  >
                    <span
                      className={`menu-item-icon-size ${
                        openSubmenu?.index === index
                          ? "menu-item-icon-active"
                          : "menu-item-icon-inactive"
                      }`}
                    >
                      {nav.icon}
                    </span>
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <span className="menu-item-text">{nav.name}</span>
                    )}
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <ChevronDownIcon
                        className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                          openSubmenu?.index === index
                            ? "rotate-180 text-brand-500"
                            : ""
                        }`}
                      />
                    )}
                  </button>
                ) : (
                  nav.path && (
                    <Link
                      to={nav.path}
                      className={`menu-item group ${
                        isActive(nav.path)
                          ? "menu-item-active"
                          : "menu-item-inactive"
                      }`}
                    >
                      <span
                        className={`menu-item-icon-size ${
                          isActive(nav.path)
                            ? "menu-item-icon-active"
                            : "menu-item-icon-inactive"
                        }`}
                      >
                        {nav.icon}
                      </span>
                      {(isExpanded || isHovered || isMobileOpen) && (
                        <span className="menu-item-text">{nav.name}</span>
                      )}
                    </Link>
                  )
                )}

                {/* Dropdown */}
                {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
                  <div
                    ref={(el) => {
                      subMenuRefs.current[index] = el;
                    }}
                    className="overflow-hidden transition-all duration-300"
                    style={{
                      height:
                        openSubmenu?.index === index
                          ? `${subMenuHeight[index]}px`
                          : "0px",
                    }}
                  >
                    <ul className="mt-2 space-y-1 ml-9">
                      {nav.subItems.map((sub) => (
                        <li key={sub.name}>
                          <Link
                            to={sub.path}
                            className={`menu-dropdown-item ${
                              isActive(sub.path)
                                ? "menu-dropdown-item-active"
                                : "menu-dropdown-item-inactive"
                            }`}
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
