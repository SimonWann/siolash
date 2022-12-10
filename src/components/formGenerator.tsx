import { Input, Radio, Switch } from "antd";
import { ConfigKeyProp } from "../routes/Settings";
import { SettingItemType } from "./SettingItem";

interface FormItemProp {
  [key: ConfigKeyProp]: JSX.Element;
}

const generalStyle = {
  width: '100px'
}

export default function (item: SettingItemType): JSX.Element {
  let result = <span>{item.value ?? '-'}</span>;
  switch (item.name) {
    case "port":
      result = <Input style={generalStyle} name={item.name} id={item.name}></Input>;
      break;
    case "socks-port":
      result = <Input style={generalStyle} name={item.name} id={item.name}></Input>;
      break;
    case "redir-port":
      result = <Input style={generalStyle} name={item.name} id={item.name}></Input>;
      break;
    case "allow-lan":
      result = <Switch></Switch>;
      break;
    case "mode":
      result = (
        <Radio.Group optionType="button" buttonStyle="solid"></Radio.Group>
      );
      break;
    case "log-level":
      <Radio.Group optionType="button" buttonStyle="solid"></Radio.Group>;
      break;
  }
  return result;
}
