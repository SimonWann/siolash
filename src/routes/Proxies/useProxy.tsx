import { message } from "antd";
import { useEffect, useState } from "react";
import { ProxiesItemType, ResponseType } from ".";
import { requestor } from "../../config/url";

export default function useProxy(
  setSelectors : React.Dispatch<React.SetStateAction<ProxiesItemType[]>>
  ): [ProxiesItemType[], typeof getProxies, boolean] {
  const [proxies, setProxies] = useState<ProxiesItemType[]>([]);
  const [proxyLoading, setProxyLoading] = useState<boolean>(false)
  function getProxies() {
    setProxyLoading(true)
    requestor({
      url: "/proxies",
    })
      .then((data) => {
        setProxyLoading(false)
        if (data.status !== 200 || !data.data?.proxies) {
          return Promise.reject(data.status);
        }
        const temp = data.data as ResponseType;
        const result = Object.entries(temp?.proxies ?? { type: "Direct" }).map(
          (val: [string, ProxiesItemType]) => ({
            ...val[1],
            name: val[0],
          })
        );
        setProxies(result);
        setSelectors(
          result
            .filter((ele) => ele.type === "Selector")
            .map((ele) => {
              return {
                ...ele,
                children: result.filter((ele2) =>
                  ele.all?.some((ele3) => ele2.name === ele3)
                ),
              };
            })
        );
      })
      .catch((err) => {
        setProxyLoading(false)
        console.log(err);
        message.error('获取配置文件失败')
      });
  }
  useEffect(() => {
    getProxies();
  }, []);
  return [
    proxies,
    getProxies,
    proxyLoading
  ]
}