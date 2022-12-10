import { message } from "antd";
import { useEffect, useState } from "react";
import { ConfigProp } from ".";
import { requestor } from "../../config/url";

export default function useUpdateConfig(value?: ConfigProp): [Promise<boolean>, boolean]{
  const [result, setResult] = useState<Promise<boolean>>(Promise.resolve(false))
  const [loading, setLoading] = useState<boolean>(false)
  function update(value: ConfigProp) {
    if(!value) return
    setLoading(true)
    requestor({
      url: '/configs',
      method: 'patch',
      data: {
        port: value.port,
        'socks-port': Number(value['socks-port']),
        'redir-port': Number(value['redir-port']),
        'allow-lan': Boolean(value['allow-lan']),
        mode: value.mode,
        'log-level': value['log-level']
      }
    })
    .then(data => {
      setLoading(false)
      if(data.status !== 204) {
        return Promise.reject(data.status)
      }
      setResult(Promise.resolve(true))
      message.success('保存成功')
    })
    .catch(err => {
      setLoading(true)
      setResult(Promise.reject(false))
      message.error('保存失败')
    })
  }
  useEffect(() => {
    update(value)
  }, [value])
  return [result, loading]
}