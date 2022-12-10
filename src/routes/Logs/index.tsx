import { List } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { baseUrl, requestor } from '../../config/url'
import style from './index.module.css'

interface Log{
  type: 'info' | 'error' | 'warning' | 'debug'
  payload: string
}

function Connections() {


  const [data, setData] = useState<Log[]>([])
  async function getTraffic(){
    return requestor<Log>({
      url: '/logs',
      responseType: 'stream'
    })
    .then(data => {
      console.log(data);
      
      return 
    })
    .catch(err => {
      console.error(err)
      return null
    })
  }
  useEffect(() => {
    // getTraffic()
    // .then(res => {
    //   if(!res) return
    //   setData([...data, res.data]) 
    //   console.log(res);
    // })
  }, [])
  

  return (
    <List
    className={style.item}
    header={<h3
    className={style.title}
    >日志</h3>}
    dataSource={data}
    renderItem={(item) => (
      <List.Item>
        <div className={style.item}>
        {item.payload}
        </div>
        </List.Item>
    )}
    ></List>
  )
}

export default Connections