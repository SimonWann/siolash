import { Button, Col, Menu, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link, Outlet, redirect, useLocation } from 'react-router-dom'
import style from './index.module.css'

function Root() {

  let location = useLocation()
  const [currentKey, setCurrentKey] = useState<string[]>([])
  const [menu, setMenu] = useState([
    {
      path: '/proxies',
      name: '代理'
    },
    {
      path: '/rules',
      name: '规则'
    },
    {
      path: '/settings',
      name: '设置'
    },
    {
      path: '/connections',
      name: '连接'
    },
    {
      path: '/logs',
      name: '日志'
    },
  ])

  useEffect(() => {
    // if()
    console.log(location);
    const result = menu.find(ele => ele.path.indexOf(location.pathname) > -1)
    console.log(result);
    
    if(result?.name)  {
      setCurrentKey([result?.name])
    }
    
  }, [location])

  return (
    <div>
      <Row
      justify={'space-between'}
      className={style.container}
      wrap={false}
      >
        <Col
        className={style.left}
        >
          <Menu
          selectedKeys={currentKey}
          >
          {menu.map(val => (
            <Menu.Item
            key={val.name}
            >
              <Link to={val.path}>
                {val.name}
              </Link>
            </Menu.Item>
          ))}
          
        </Menu>
        </Col>
        <Col
        className={style.right}
        // offset={1}
        flex={1}
        span={20}
        ><Outlet></Outlet></Col>
      </Row>
      
      
    </div>
  )
}

export default Root