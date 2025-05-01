import React, { useState, useEffect } from 'react'
import {
  MenuOutlined,
  ProjectOutlined,
  UserOutlined,
  TeamOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { RxDashboard } from "react-icons/rx"
import { TbUsersGroup } from "react-icons/tb";
import { LuBarChartBig } from "react-icons/lu";
import { MdOutlineGroupAdd } from "react-icons/md";
import logoImage from '../../assets/images/logo.png'
import SidebarItem from './SiderbarItem';
import './styles.scss'
import useIsMobile from '../../utils/isMobile';
import localStorageContent from '../../utils/localstorage';
import { timeZoneOptions } from '../../containers/Sales/Sales-Report/constants';
import Timer from '../Timer';
import { BiPhone } from 'react-icons/bi';
import { BiSupport, BiSolidFile } from "react-icons/bi"

const Sidebar: React.FC<any> = () => {
  const [toggleMenu,setToggleMenu] = useState<boolean>(false)
  const [showSidebar,setShowSidebar] = useState<boolean>(true)
  const isMobile = useIsMobile()
  let localUserData = localStorageContent.getUserData()

  const toggleMenuBar = () => {
    setToggleMenu(!toggleMenu)
  }

  //give -1 in array of departmentAccess for admin 
  const sidebarItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      Icon: RxDashboard, 
      accessRoles: [1,2,3,4,5,6],
      departmentAccess: [-1,1,2,3,4,5,6,22],
    },
    {
      title: 'Departments',
      path: '/departments',
      Icon: TbUsersGroup, 
      accessRoles: [1],
      departmentAccess: [-1],
    },
    {
      title: 'Admin',
      path: '/admin',
      Icon: UserOutlined, 
      accessRoles: [1],
      departmentAccess: [-1],
    },
    // {
    //   title: 'Team Lead',
    //   path: '/teamlead',
    //   Icon: UserOutlined, 
    //   accessRoles: [1],
    //   departmentAccess: [-1],
    // },
    {
      title: 'Team',
      path: '/team',
      Icon: TeamOutlined, 
      accessRoles: [1,2],
      departmentAccess: [-1,1,2,3,4,5,6,22],
    },
    {
      title: 'Reports',
      path: '/reports',
      Icon: ProjectOutlined, 
      accessRoles: [1,2,3,5],
      departmentAccess: [-1,2,3,4,5,6,7,8,9],
    },
    {
      title: 'Configuration',
      path: '/configuration',
      Icon: SettingOutlined, 
      accessRoles: [1],
      departmentAccess: [-1],
    },
    {
      title: 'Sales',
      path: '/sales',
      Icon: LuBarChartBig, 
      accessRoles: [1,2,3,5],
      departmentAccess: [-1,1],
    },
    {
      title: 'Leads',
      path: '/leads',
      Icon: MdOutlineGroupAdd, 
      accessRoles: [2,3,5],
      departmentAccess: [2, 3, 4, 5, 6],
    },
    {
      title: 'Walkouts',
      path: '/walkouts',
      Icon: MdOutlineGroupAdd, 
      accessRoles: [1, 2,3],
      departmentAccess: [-1, 5],
    },
    {
      title: 'Referals',
      path: '/referals',
      Icon: LuBarChartBig, 
      accessRoles: [1,2,3,5],
      departmentAccess: [-1, 1],
    },
    {
      title: 'Tax Config',
      path: '/tax-configuration',
      Icon: LuBarChartBig, 
      accessRoles: [2],
      departmentAccess: [4],
    },
    {
      title: 'Help Desk',
      path: '/support',
      Icon: BiSupport, 
      accessRoles: [1,2,3,5],
      departmentAccess: [-1,2,3,4,5,6,7,8,9,22],
    },
    {
      title: 'Escalation',
      path: '/escalation',
      Icon: BiSolidFile, 
      accessRoles: [1,2,3,5],
      departmentAccess: [-1,22],
    },
  ]

  useEffect(() => {
    if(isMobile){
      setToggleMenu(true)
    }else{
      setToggleMenu(false)
    }
    
  }, [isMobile])

  useEffect(() => {
    if (localUserData?.departmentId === 22) {
      setShowSidebar(true)
    } else if(localUserData && localUserData?.departmentId > 6){
      setShowSidebar(false)
    }  
  }, [])

  if(!showSidebar){
    return <></>
  }
  

  return (
    <div className={`sidebar-container ${toggleMenu ? 'sidebar-responsive' : ''}`}>
      <div className='sidebar-container__logo'>
        {
          !toggleMenu && (
            <div className='sidebar-container__logo--image'>
              <img src={logoImage} alt='logo' />
            </div>
          )
        }
        <div className='sidebar-container__logo--menu' onClick={toggleMenuBar}>
          <MenuOutlined />
        </div>
      </div>
      {
        sidebarItems.map((sidebar: any) => {
          const { Icon, title, path, accessRoles, departmentAccess } = sidebar;
          if(localUserData?.role === '1'){
            localUserData.departmentId = -1
          }
          if(localUserData && accessRoles.includes(Number(localUserData.role)) && (localUserData?.departmentId !== undefined && departmentAccess.includes(localUserData?.departmentId))){
            return (
              <SidebarItem 
                Icon={Icon}
                title={title}
                path={path}
                showTitle={toggleMenu}
              />
            )           
          }else{
            return <></>
          }
        })
      }
      {
        localUserData?.role === '3' && <div style={{ display: 'block' }}>
          {
            timeZoneOptions.map((time: any) => <Timer timer={time} />)
          }
        </div>
      }
    </div>
  )
}

export default Sidebar