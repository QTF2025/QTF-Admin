import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Auth from './containers/Auth'
import './styles.scss';
import { useDispatch, useSelector } from 'react-redux';
import { IInitialState } from './store/reducers/models';
import { message } from 'antd';
import { setError } from './store/reducers';
import localStorageContent from './utils/localstorage';
import Layout from './containers/Layout';
import Departments from './containers/Departments';
import Admin from './containers/Admin';
import Team from './containers/Team';
import Reports from './containers/Reports';
import Sales from './containers/Sales';
import Leads from './containers/Leads';
import Dashboard from './containers/Dashboard';
import DepartmentForm from './containers/Departments/Form';
import AdminForm from './containers/Admin/Form';
import TeamForm from './containers/Team/Form';
import Lead from './containers/Leads/Lead';
import ProtectedRoutes from './components/ProtectedRoutes';
import SalesData from './containers/Sales/Form'
import Referals from './containers/Referals';
import SalesDataReports from './containers/Sales/Sales-Report';
import Configure from './containers/Configure';
import Notifications from './containers/Notifications';
import TaxConfiguration from './containers/TaxConfiguration';
import UnAuthorized from './components/UnAuthorized';
import NotFound from './components/NotFound';
import TeamLead from './containers/TeamLead';
import TeamLeadForm from './containers/TeamLead/Form'
import Support from './containers/Support';
import Escalation from './containers/Escalation';
import Comments from './containers/Support/Form/Comments';

const routerComponents = [
  {
    path: '/dashboard',
    Component: Dashboard,
  },
  {
    path: '/departments',
    Component: Departments,
  },
  {
    path: '/departments/create',
    Component: DepartmentForm,
  },
  {
    path: '/departments/edit/:id',
    Component: DepartmentForm,
  },
  {
    path: '/admin',
    Component: Admin,
  },
  {
    path: '/admin/create',
    Component: AdminForm,
  },
  {
    path: '/admin/edit/:id',
    Component: AdminForm,
  },
  {
    path: '/teamlead',
    Component: TeamLead,
  },
  {
    path: '/teamlead/create',
    Component: TeamLeadForm,
  },
  {
    path: '/teamlead/edit/:id',
    Component: TeamLeadForm,
  },
  {
    path: '/team',
    Component: Team,
  },
  {
    path: '/team/create',
    Component: TeamForm,
  },
  {
    path: '/team/edit/:id',
    Component: TeamForm,
  },
  {
    path: '/reports',
    Component: Reports,
  },
  {
    path: '/configuration',
    Component: Configure,
  },
  {
    path: '/sales',
    Component: Sales,
  },
  {
    path: '/sales/data-upload',
    Component: SalesData,
  },
  {
    path: '/sales/report',
    Component: SalesDataReports,
  },
  {
    path: '/sales/followup-calls',
    Component: SalesDataReports,
  },
  {
    path: '/leads',
    Component: () => <Leads isLeads/>
  },
  {
    path: '/walkouts',
    Component: () => <Leads isLeads={false} />
  },
  {
    path: '/leads/create',
    Component: Lead
  },
  {
    path: '/leads/edit/:id',
    Component: Lead
  },
  {
    path: '/referals',
    Component: Referals
  },
  {
    path: '/notifications',
    Component: Notifications
  },
  {
    path: '/tax-configuration',
    Component: () => <TaxConfiguration section={'TAX_CONFIG'} leadData={null} showHeader={true} />
  },
  {
    path: '/support',
    Component: Support
  },
  {
    path: '/support/view/:id',
    Component: Comments,
  },
  {
    path: '/escalation',
    Component: Escalation
  },
  {
    path: '/escalation/view/:id',
    Component: Escalation,
  },

]

function App() {
  const [messageApi, contextHolder] = message.useMessage();
  const gloablStore = useSelector((state: any) => state.store)
  const { showAlert, alertMessage, alertType, isAuthenticated }: IInitialState = gloablStore;
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if(showAlert){
      messageApi.open({
        type: alertType,
        content: alertMessage,
      });

      setTimeout(() => {
        dispatch(setError({ status: false, type: undefined, message: '' }))
      }, 1000)
    }
  }, [showAlert, alertType, alertMessage])

  return (
    <div className="App">
        <ToastContainer />
        {contextHolder}
      <Routes>
        <Route path='/' element={<Auth />} />
        <Route path='/unauthorized' element={<UnAuthorized />} />
        <Route element={<Layout />}>
          {
            routerComponents.map((router: any) => {
              const { path, Component } = router
              return <Route path={path} element={<ProtectedRoutes><Component /></ProtectedRoutes>} />
            })
          }
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
