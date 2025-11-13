import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";

export default function MonthlyCollectionProgress() {
  const series = [78.2]; // Current monthly collection %
  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: { fontFamily: "Outfit, sans-serif", type: "radialBar", height: 330, sparkline: { enabled: true } },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: { size: "80%" },
        track: { background: "#E4E7EC", strokeWidth: "100%", margin: 5 },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: (val) => `${val}%`,
          },
        },
      },
    },
    stroke: { lineCap: "round" },
  };

  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Current Monthly Collection
            </h3>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
              Track your revenue collection goal this month
            </p>
          </div>

          <div className="relative inline-block">
            <button className="dropdown-toggle" onClick={toggleDropdown}>
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
            </button>
            <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
              <DropdownItem onItemClick={closeDropdown}>View Details</DropdownItem>
              <DropdownItem onItemClick={closeDropdown}>Reset Target</DropdownItem>
            </Dropdown>
          </div>
        </div>

        <div className="relative">
          <Chart options={options} series={series} type="radialBar" height={330} />
          <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500">
            +7.5%
          </span>
        </div>

        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
          You've collected ₹52,000 this month. Great progress — just ₹15,000 away from your target!
        </p>
      </div>

      <div className="flex items-center justify-center gap-5 px-6 py-4 sm:gap-8 sm:py-5">
        <div className="text-center">
          <p className="mb-1 text-gray-500 text-sm">Total Pricing Initiated</p>
          <p className="font-semibold text-gray-800 dark:text-white/90">₹85,000</p>
        </div>
        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>
        <div className="text-center">
          <p className="mb-1 text-gray-500 text-sm">Yearly Sales</p>
          <p className="font-semibold text-gray-800 dark:text-white/90">₹6.4L</p>
        </div>
      </div>
    </div>
  );
}
