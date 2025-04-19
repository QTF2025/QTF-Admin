import React, { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import localStorageContent from '../../../utils/localstorage';

const SidebarItem = ({ Icon, title, path, showTitle }: any) => {
  const navigate = useNavigate()
  const location = useLocation();
  const localUserData = localStorageContent.getUserData();

  const isActive = useMemo(() => {
  const titleName = title.toLowerCase().replace(/ /g,"");
  const { pathname } = location;  
    return pathname === path || pathname === titleName
  }, [location, title, path])

  const onClickItem = () => {
    if(title === 'Sales' && localUserData){
        if (["1", "2"].includes(localUserData.role)){
          navigate('/sales')
          return
        }
        if (["3"].includes(localUserData.role)) {
          navigate('/sales/report')
          return
        }
    }else{
      navigate(path)
    }
  }

  return (
    <div className={`sidebar-container__item ${isActive ? 'sidebar-container__item-selected' : ''}`} onClick={onClickItem}>
        <div>
          <Icon />
        </div>
        {
          !showTitle && <p>{title}</p>
        }
      </div>
  )
}

export default SidebarItem