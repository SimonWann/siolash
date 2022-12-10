import { Button, Card, Col, message, Row, Space, Spin } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { requestor } from "../../config/url";
import style from "./index.module.css";
import classNames from "classnames/bind";
import { CheckCircleFilled } from "@ant-design/icons";
import { CSSTransition } from "react-transition-group";
import useProxy from "./useProxy";
import useDelay from "./useDelay";
import useSelector from "./useSelector";
const cx = classNames.bind(style);

export type ProxyType =
  | "Direct"
  | "Reject"
  | "Selector"
  | "Shadowsocks"
  | "Socks5"
  | "URLTest";
export type SelectorType = "all" | "now";
export interface ProxiesItemType {
  all?: string[];
  now?: string;
  type: ProxyType;
  udp?: boolean;
  name?: string;
  delay?: number;
  children?: ProxiesItemType[];
}
export interface ResponseType {
  proxies: {
    [key: string]: ProxiesItemType;
  };
}

function Proxies() {
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const input = useRef<HTMLDivElement | null>(null);
  const [
    selector,
    setSelectors,
    renderSelector,
    currentFilterStr,
    setCurrentFilterStr,
  ] = useSelector();
  const [proxies, getProxies, dataLoading] = useProxy(setSelectors);

  function updateSelector(selector: string, name: string) {
    if (name.length > 0) {
      requestor({
        url: `/proxies/${selector}`,
        method: "put",
        data: {
          name,
        },
      })
        .then((data) => {
          if (data.status !== 204) {
            return Promise.reject(Error(data.status.toString()));
          }
          getProxies();
        })
        .catch((err) => {
          message.error("切换失败");
          console.error(err.message);
        });
    } else {
      message.error("切换失败");
    }
  }

  const [testLoading, getAllProxiesDelay] = useDelay([selector, setSelectors]);

  return (
    <Row>
      <Col span={24}>
        <div
          className={cx({
            nav_container: true,
          })}
        >
          <div
            className={cx({
              nav: true,
            })}
            ref={input}
            onBlur={(e) => {
              if (input.current) {
                if (/\s/.test(input.current.innerText ?? "")) {
                  input.current.innerText = currentFilterStr
                    ? currentFilterStr.trim()
                    : "";
                }
              }
            }}
            onInput={(e) => {
              if (timer) {
                clearTimeout(timer.current);
                timer.current = setTimeout(() => {
                  setCurrentFilterStr((e.target.innerText ?? "").trim());
                }, 200);
              }
            }}
            contentEditable
            data-placeholder={"搜索……"}
          ></div>
          <Button
            type="link"
            loading={testLoading}
            onClick={() => {
              getAllProxiesDelay(
                proxies
                  .map((val) => val.name)
                  .filter((val) => typeof val === "string") as string[]
              );
            }}
          >
            测试延迟
          </Button>
        </div>
      </Col>
      <Col span={24}>
        <Spin spinning={dataLoading}>
          {renderSelector.map((parent) => (
            <Row
            key={parent.name}
            >
              <Col span="24">
                <h3 className={style.group}>{parent.name}</h3>
              </Col>
              <Col span="24">
                <Row gutter={[24, 16]}>
                  {(parent.children ?? []).map((ele) => (
                    <Col key={ele.name} span={8} xl={6} lg={8} md={12} sm={12} xs={24}>
                      <Card
                        onClick={() => {
                          if (
                            typeof ele.name !== "string" ||
                            typeof parent.name !== "string"
                          ) {
                            message.error("节点出现问题");
                            return;
                          }
                          if (parent.type !== "Selector") {
                            message.warning("节点不可选");
                            return;
                          }
                          updateSelector(parent.name, ele.name);
                        }}
                        className={cx({
                          [style.card]: true,
                          [style.card_active]:
                            parent.type === "Selector" &&
                            parent.now === ele.name,
                        })}
                        title={
                          <div className={style.card_title}>
                            <div>{ele.name}</div>
                            <div>
                              {" "}
                              <CSSTransition
                                in={
                                  parent.type === "Selector" &&
                                  parent.now === ele.name
                                }
                                timeout={250}
                                classNames={{
                                  enter: style.card_enter,
                                  enterActive: style.card_enter_active,
                                  enterDone: style.card_enter_done,
                                  exit: style.card_exit,
                                  exitActive: style.exit_active,
                                  exitDone: style.exit_done,
                                }}
                                unmountOnExit
                              >
                                <CheckCircleFilled
                                  style={{ color: "#3689e6" }}
                                />
                              </CSSTransition>
                            </div>
                          </div>
                        }
                      >
                        <Row justify={"space-between"}>
                          <Col>
                            <span
                            style={{
                              fontSize: '14px'
                            }}
                            >{ele.type}</span>
                          </Col>
                          <Col>
                            <span>{ele.delay ? `${ele.delay}ms` : "-"}</span>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          ))}
        </Spin>
      </Col>
    </Row>
  );
}

export default Proxies;
