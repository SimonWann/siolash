import { useMemo, useState } from "react";
import { ProxiesItemType } from ".";

export default function useSelector() : [
  ProxiesItemType[],
  React.Dispatch<React.SetStateAction<ProxiesItemType[]>>,
  typeof renderSelector,
  string | undefined,
  React.Dispatch<React.SetStateAction<string | undefined>>
]{
  const [selector, setSelectors] = useState<ProxiesItemType[]>([]);
  const [currentFilterStr, setCurrentFilterStr] = useState<
    string | undefined
  >();

  const renderSelector = useMemo(() => {
    return selector
      .map((val) => ({
        ...val,
        children: (val.children ?? []).filter((proxy) => {
          let text = Object.values(proxy)
            .filter((val) => val)
            .join("")
            .toLowerCase();

          return (
            (text.indexOf((currentFilterStr ?? "").toLowerCase()) ?? 0) > -1
          );
        }),
      }))
      .filter((ele) => (ele.children ?? []).length > 0);
  }, [selector, currentFilterStr]);

  
  return [
    selector,
    setSelectors,
    renderSelector,
    currentFilterStr,
    setCurrentFilterStr
  ]
}