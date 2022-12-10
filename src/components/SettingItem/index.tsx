import { Form } from 'antd'
import React from 'react'
import { ConfigKeyProp, ConfigProp, ConfigValueProp } from '../../routes/Settings'
import formGenerator from '../formGenerator'
import style from './index.module.css'
export interface SettingItemType{
  name: ConfigKeyProp,
  label: string,
  key?: React.Key,
  value?: ConfigValueProp
}
function SettingItem(p: SettingItemType) {
  return (
      formGenerator(p)
  )
}

export default SettingItem