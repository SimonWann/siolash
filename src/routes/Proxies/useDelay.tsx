import { useState } from "react";
import { ProxiesItemType } from ".";
import { requestor } from "../../config/url";

export default function useDelay(
  [selector, setSelectors]: [ProxiesItemType[], React.Dispatch<React.SetStateAction<ProxiesItemType[]>>]
): [boolean, typeof getAllProxiesDelay] {
  const [testLoading, setTestLoading] = useState<boolean>(false);
  async function getProxyDelay(proxy: string) {
    return requestor({
      url: `/proxies/${encodeURIComponent(proxy)}/delay`,
      params: {
        timeout: 5000,
        url: "http://www.google.com",
      },
    }).then((data) => {
      if (data.status !== 200) {
        return Promise.reject(data.statusText);
      }
      return Promise.resolve({
        name: proxy,
        ...data.data,
      });
    });
  }
  function getAllProxiesDelay(proxies: string[]) {
    setTestLoading(true);
    Promise.allSettled(proxies.map((proxy) => getProxyDelay(proxy)))
      .then((data) => {
        setTestLoading(false);
        const delay_group = data
          .filter((val) => val.status === "fulfilled")
          .map((val) => val.status === 'fulfilled' ? val?.value : undefined);
        setSelectors(
          selector
            .filter((val) => (val.children ?? []).length > 0)
            .map((val) => ({
              ...val,
              children: (val.children ?? []).map((node) => {
                return {
                  ...node,
                  delay:
                    delay_group.find((delay) => delay.name === node.name)
                      ?.delay ?? node.delay,
                };
              }),
            }))
        );
      })
      .catch((err) => {
        setTestLoading(false);
        console.error(err);
      });
  }
  return [testLoading, getAllProxiesDelay]
}