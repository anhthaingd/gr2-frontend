import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Outlet } from "react-router-dom";
import LoginScreen from "./components/authScreen/LoginScreen";
import Home from "./components/generalScreen/Home";
import Header from "./components/generalScreen/Header";
import Footer from "./components/generalScreen/Footer";
import RegisterScreen from "./components/authScreen/RegisterScreen";
import CveList from "./pages/CveList";
import CveDetail from "./pages/CveDetail";
import CweDetail from "./pages/CweDetail";
import CapecDetail from "./pages/CapecDetail";
import AddStory from "./components/storyScreen/AddStory";
import PostDetail from "./pages/PostDetail";
import EditStory from "./components/storyScreen/EditStory";
import Profile from "./pages/Profile";
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LayoutsWithHeader />}>
            <Route exact path="/cves" element={<CveList />} />
            <Route exact path="/cves/:cveId" element={<CveDetail />} />
            <Route exact path="/cwes/:cweId" element={<CweDetail />} />
            <Route exact path="/capecs/:capecId" element={<CapecDetail />} />
            <Route exact path='/addstory' element={<AddStory />} />
            <Route exact path="/post/:postId" element={<PostDetail />} />
            <Route exact path="/post/:postId/edit" element={<EditStory />} />
            <Route exact path="/profile" element={<Profile />} />
            {/* <Route path="*" element={<NotFound />} />

            <Route exact path="/" element={<PrivateRoute />}>
              <Route exact path="/" element={<Home />} />
            </Route>

            <Route exact path="/story/:slug" element={<DetailStory />} />

            <Route exact path="/addstory" element={<PrivateRoute />}>
              <Route exact path="/addstory" element={<AddStory />} />
            </Route>

            <Route exact path="/profile" element={<PrivateRoute />}>
              <Route exact path="/profile" element={<Profile />} />
            </Route> */}

            {/* <Route exact path="/edit_profile" element={<PrivateRoute />}>
              <Route exact path="/edit_profile" element={<EditProfile />} />
            </Route> */}
            <Route exact path="/" element={<Home />} />

            <Route exact path="/change_Password">
              <Route
                exact
                path="/change_Password"
                // element={<ChangePassword />}
              />
            </Route>

            {/* <Route exact path="/story/:slug/like" element={<PrivateRoute />}>
              <Route exact path="/story/:slug/like" element={<DetailStory />} />
            </Route> */}

            {/* <Route exact path="/story/:slug/edit" element={<PrivateRoute />}>
              <Route exact path="/story/:slug/edit" element={<EditStory />} />
            </Route> */}

            <Route exact path="/story/:slug/delete">
              <Route
                exact
                path="/story/:slug/delete"
                // element={<DetailStory />}
              />
            </Route>
            <Route
              exact
              path="/story/:slug/addComment"
              // element={<PrivateRoute />}
            >
              <Route
                exact
                path="/story/:slug/addComment"
                // element={<DetailStory />}
              />
            </Route>

            {/* <Route exact path="/readList" element={<PrivateRoute />}>
              <Route exact path="/readList" element={<ReadListPage />} />
            </Route> */}
          </Route>

          <Route exact path="/login" element={<LoginScreen />} />
          <Route exact path="/register" element={<RegisterScreen />} />

          <Route
            exact
            path="/forgotpassword"
            // element={<ForgotPasswordScreen />}
          />

          <Route
            exact
            path="/resetpassword"
            // element={<ResetPasswordScreen />}
          />
        </Routes>
      </div>
    </Router>
  );
}
const LayoutsWithHeader = () => {
  return (
    <>
      <Header />
      <Outlet/>
      <Footer />
    </>
  );
};

export default App;
