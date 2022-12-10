import { Col, List, Row, Space } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { requestor } from '../../config/url'
import VirtualList from 'rc-virtual-list';
import style from './index.module.css'

export interface RuleType{
  type: string,
  payload: string,
  proxy: string,
  key?: React.Key
}
interface RuleResponseType {
  rules: RuleType[]
}

function Rules() {

  const [rules, setRules] = useState<RuleType[]>([])

  function getRules() {
    requestor<RuleResponseType>({
      url: '/rules'
    })
    .then(data => {
      console.log(data);
      if(data.status !== 200) {
        return Promise.reject(data.status)
      }
      setRules((data.data?.rules ?? []).map(val => ({
        ...val,
        key: crypto.randomUUID()
      })))
    })
  }
  useEffect(() => {
    getRules()
  }, [])

  return (
    <main
    className={style.rules}
    >
      <List
      >
        <VirtualList
        data={rules}
        itemKey={'key'}
        itemHeight={105}
        height={document.documentElement.getBoundingClientRect().height - 40}
        >
          {(item) => (
            <List.Item
            >
              <Row
              align={'middle'}
              style={{
                width: '100%'
              }}
              >
                <Col
                span={6}
                ><h3>{item.type}</h3></Col>
                <Col
                span={12}
                ><p>{item.payload}</p></Col>
                <Col
                span={6}
                ><p>{item.proxy}</p></Col>
              </Row>
              
            </List.Item>
          )}
        </VirtualList>
        
      </List>
    </main>
  )
}

export default Rules