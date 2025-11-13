import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
       title="Unique Record of Universe | Manage Data, Insights & Achievements"
        description="Unique Record of Universe Dashboard – Seamlessly manage records, track insights, analyze achievements, and explore data of the universe in one powerful dashboard."
      />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* 📊 Left Section: Key Metrics & Reports */}
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />
          <MonthlySalesChart />
        </div>

        {/* 🎯 Right Section: Internship Targets */}
        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        {/* 📈 Internship Statistics Section */}
        <div className="col-span-12">
          <StatisticsChart />
        </div>

        {/* 👥 Demographics & Recent Activities */}
        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div>
      </div>
    </>
  );
}
