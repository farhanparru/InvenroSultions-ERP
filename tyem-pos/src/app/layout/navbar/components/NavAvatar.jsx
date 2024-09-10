
import { SettingOutlined,LogoutOutlined,UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown } from 'antd'
import avatar from '../../../../assets/avatar.jpg'
import React from 'react'

const NavAvatar = ({name,role,email}) => {

  const items = [
    {
      key: '1',
      label: 'Profile',
      icon: <UserOutlined />,
    },
    // {
    //   key: '2',
    //   label: 'Settings',
    //   icon: <SettingOutlined />,
    //   disabled: true,
    // },
    // {
    //   key: '3',
    //   danger: true,
    //   label: 'Logout',
    //   icon: <LogoutOutlined />,
    // },
  ];
  return (
    <Dropdown menu={{ items }} >
     <div className="nav__avatar flex gap-2">
      <Avatar className=' border-1 border-gray-400' size={40} src={avatar} />
    <div className="nav__avatar-detail">
      <h2 className='font-bold text-white'>{name}</h2>
      <p className='text-xs text-white'>{role}</p>
    </div>
   </div>
  </Dropdown>
   
  )
}

export default NavAvatar
