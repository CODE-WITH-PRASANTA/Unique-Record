import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import CreateBlog from "./Functions/CreateBlog/CreateBlog";
import PostNotice from "./Functions/PostNotice/PostNotice";
import AddEventSystem from "./Functions/AddEventSystem/AddEventSystem";
import ManageteamMember from "./Functions/ManageteamMember/ManageteamMember";
import EventRegisterPeople from "./Functions/EventRegisterPeople/EventRegisterPeople";
import ManageCategory from "./Functions/ManageCategory/ManageCategory";
import DonationManage from "./Functions/DonationManage/DonationManage";
import SubScribeLetter from "./Functions/SubScribeLetter/SubScribeLetter";
import ManageUru from "./Functions/ManageUru/ManageUru";
import EditManageUruForm from "./Functions/EditManageUruForm/EditManageUruForm";
import AddAchivment from "./Functions/AddAchivment/AddAchivment";
import FinalUru from "./components/FinalUru/FinalUru";
import Approveuru from "./Functions/Approveuru/Approveuru";
import TeamMembersPreview from "./Functions/TeamMembersPreview/TeamMembersPreview";
import AddEventPreview from "./Functions/AddEventPreview/AddEventPreview";
import PostNoticePreview from "./Functions/PostNoticePreview/PostNoticePreview";
import BlogPreview from "./Functions/BlogPreview/BlogPreview";


export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />

            {/* Others Page */}
            <Route path="profile" element={<UserProfiles />} />
            <Route path="blank" element={<Blank />} />

            {/* Forms */}
            <Route path="form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="basic-tables" element={<BasicTables />} />

            {/* Charts */}
            {/* <Route path="line-chart" element={<LineChart />} />
            <Route path="bar-chart" element={<BarChart />} /> */}

              {/* Page Path Manage */}
          <Route path="/blogs/add" element={<CreateBlog />} />
          <Route path="/blogs/preview" element={<BlogPreview />} />

          <Route path="/notice/add" element={<PostNotice />} />
          <Route path="/notice/preview" element={<PostNoticePreview />} />

        
          <Route path="/event/add" element={<AddEventSystem />} /> 
          <Route path="/event/preview" element={<AddEventPreview />} /> 


          <Route path="/team/members" element={<ManageteamMember />} /> 
          <Route path="/team/preview" element={<TeamMembersPreview />} /> 


          
          <Route path="/event/register" element={<EventRegisterPeople />} /> 
          <Route path="/category/manage" element={<ManageCategory />} /> 
          <Route path="/donation/manage" element={<DonationManage />} /> 
          <Route path="/subscribe-letter" element={<SubScribeLetter />} /> 

          <Route path="/uru/manage" element={<ManageUru />} /> 
          <Route path="/uru/approve" element={<Approveuru />} /> 
          <Route path="/uru/final" element={<FinalUru />} /> 
          
          
          <Route path="/uru/manage/edit/:id" element={<EditManageUruForm />} />
          <Route path="/achievements/add" element={<AddAchivment />} />

          
          </Route>

          {/* Auth Layout */}
          <Route path="/TailAdmin/signin" element={<SignIn />} />
          <Route path="/TailAdmin/signup" element={<SignUp />} />
                

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
