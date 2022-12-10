import { Button, Col, Form, message, Row, Space } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { requestor } from '../../config/url'
import style from './index.module.css'
import Logs from '../Connections'
import SettingItem, { SettingItemType } from '../../components/SettingItem'
import useUpdateConfig from './useUpdateConfig'

class Authentication{
  user: string
  pass: string
  constructor(str: string) {
    const [user, pass] = str.split(':')
    this.user = user
    this.pass = pass
  }
  toString() {
    return `${this.user}:${this.pass}`
  }
}
export type Log = 'info' | 'warning' | 'error' | 'debug' | 'silent'
export type Mode = "rule" | "global" | 'direct'
export type ConfigValueProp = number | string | string[] | null | Log | Mode | boolean
export interface ConfigProp{
  "port": number, // https(s) 端口
  "socks-port": number, //socks5 端口
  "redir-port": number, // 透明代理端口（linux与macos）
  "tproxy-port": number, // 透明代理端口（linux）
  "mixed-port": number, //混合端口
  "authentication": string[], //认证
  "allow-lan": boolean, //是否允许lan
  "bind-address": string, // 绑定地址
  "mode": Mode, // 模式
  "log-level": Log,
  "ipv6": boolean,
  [key: string]: ConfigValueProp
}
export type ConfigKeyProp = keyof ConfigProp
interface ValidateType{
  pattern?: RegExp;
  message: string;
  required?: boolean;
}

function Settings() {

  const [data, setData] = useState<ConfigProp | null>(null)
  const [form] = Form.useForm()
  const [formValue, setFormValue] = useState<ConfigProp>()
  const configEnum = useMemo<(SettingItemType & {rule?: ValidateType[]})[]>(() =>  {
    if(!data) {
      return []
    }
    return [
      {
        name: 'port',
        label: 'http(s)端口',
        rule: [
          {
            required: true,
            message: '请填写端口'
          },
          {
            pattern: /^\d{1,}$/,
            message: '端口格式不正确'
          }
        ]
      },
      {
        name: 'socks-port',
        label: 'sock5端口',
        rule: [
          {
            required: true,
            message: '请填写端口'
          },
          {
            pattern: /^\d{1,}$/,
            message: '端口格式不正确'
          }
        ]
      },
      {
        name: 'redir-port',
        label: '透明代理(linux和macos)',
        rule: [
          {
            required: true,
            message: '请填写端口'
          },
          {
            pattern: /^\d{1,}$/,
            message: '端口格式不正确'
          }
        ]
      },
      {
        name: 'tproxy-port',
        label: '透明代理(linux)',
        // rule: [
        //   {
        //     required: true,
        //     message: '请填写端口'
        //   },
        //   {
        //     pattern: /^\d{1,}&/,
        //     message: '端口格式不正确'
        //   }
        // ]
      },
      {
        name: 'mixed-port',
        label: '混合端口',
      },
      {
        name: 'authentication',
        label: '认证'
      },
      {
        name: 'bind-address',
        label: 'Lan的绑定地址'
      },
      {
        name: 'allow-lan',
        label: '是否允许Lan',
      },
      {
        name: 'mode',
        label: '模式'
      },
      {
        name: 'log-level',
        label: '日志等级'
      },
      {
        name: 'ipv6',
        label: '是否转发ipv6'
      },
    ].map(val => ({
      ...val,
      value: data[val.name]
    }))
  },[data])
  function getConfig() {
    requestor({
      url: '/configs'
    })
    .then(data => {
      if(data.status !== 200) {
        return Promise.reject(Error(data.status.toString()))
      }
      setData(data.data ?? {})
      form.setFieldsValue(data.data ?? {})
    })
  }
  const [result, loading] = useUpdateConfig(formValue)

  useEffect(() => {
    getConfig()
  }, [])
  
  return (
    <Row
    className={style.settings}
    
    >
      <Col flex={1}>
        <Form
        form={form}
        onFinish={(value: ConfigProp) => {
          setFormValue(value)
        }}
        onValuesChange={(value: ConfigProp) => {
          // setFormValue(value)
        }}
        >
          <Form.Item
          wrapperCol={{
            offset: 20,
            span: 4
          }}
          
          >
            <Space
            // size={'large'}
            >
              {/* <Button
              size='large'
              type="primary"
              danger
              >取消</Button> */}
              <Button
              size='large'
              type="primary"
              htmlType='submit'
              // disabled={true}
              loading={loading}
              // style={{
              //   opacity: '0'
              // }}
              >保存配置</Button>
            </Space>
          </Form.Item>
          {configEnum.map(val => (
            <Form.Item
            label={val.label}
            labelAlign={'right'}
            rules={val.rule ?? []}
            name={val.name}
            valuePropName={val.name === 'allow-lan' ? 'checked' : 'value'}
            labelCol={{
              span: 10
            }}
            wrapperCol={{
              offset: 1,
              span: 12
            }}
            >
              {SettingItem(val)}
            </Form.Item>
          ))}
        </Form>
      </Col>
    </Row>
  )
}

export default Settings