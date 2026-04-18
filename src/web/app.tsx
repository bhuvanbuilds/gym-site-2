import { Route, Switch } from "wouter";
import Index from "./pages/index";
import MemberPage from "./pages/member";
import AdminLogin from "./pages/admin/login";
import AdminDashboard from "./pages/admin/index";
import AdminMembers from "./pages/admin/members";
import AdminAttendance from "./pages/admin/attendance";
import AdminLeads from "./pages/admin/leads";
import { Provider } from "./components/provider";

function App() {
  return (
    <Provider>
      <Switch>
        <Route path="/" component={Index} />
        <Route path="/member" component={MemberPage} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/members" component={AdminMembers} />
        <Route path="/admin/attendance" component={AdminAttendance} />
        <Route path="/admin/leads" component={AdminLeads} />
      </Switch>
    </Provider>
  );
}

export default App;
