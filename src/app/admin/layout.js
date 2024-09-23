"use client";
import { Layout, Menu, Typography, Row, message, Spin } from "antd";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BsBoxArrowLeft, BsFillPeopleFill } from "react-icons/bs";
import { AiFillFileText } from "react-icons/ai";
const AdminLayout = (props) => {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [token, setToken] = useState(null);
  useEffect(() => {
    const stored = localStorage.getItem("@auth_token");
    if (stored) {
      setToken(stored);
    } else {
      router.push("/");
    }
  }, []);
  const getItem = (label, key, icon, children, style, type) => {
    return {
      label,
      key,
      icon,
      children,
      style,
      type,
    };
  };
  if (!token) {
    return (
      <div className="loadingContainer">
        <Spin size="large" />
      </div>
    );
  }
  return (
    <Layout style={{ height: "100vh" }}>
      <Layout.Sider
        style={{ overflow: "scroll" }}
        width={230}
        breakpoint="lg"
        theme="light"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          setCollapsed(collapsed);
        }}
      >
        <Row justify="center" style={{ marginBlock: 40 }}>
          <Typography.Title style={{ fontSize: collapsed ? 12 : 34 }}>
            KONNECT
          </Typography.Title>
        </Row>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
            height: "80vh",
          }}
        >
          <Menu
            style={{ fontSize: "16px", fontWeight: "500" }}
            theme="light"
            mode="inline"
            defaultSelectedKeys={[pathname]}
            onClick={(e) => router.push(e.key)}
            items={[
              getItem(
                "Users",
                "/admin/users",
                <BsFillPeopleFill size={collapsed ? 16 : 24} />,
                null,
                { marginBottom: "30px" }
              ),
              getItem(
                "Posts Detail",
                "/admin/posts",
                <AiFillFileText size={collapsed ? 16 : 24} />,
                null,
                { marginBottom: "30px" }
              ),
              getItem(
                "Services Request",
                "/admin/servicesRequest",
                <AiFillFileText size={collapsed ? 16 : 24} />,
                null,
                { marginBottom: "30px" }
              ),
            ]}
          />

          {collapsed ? (
            <Row
              justify="center"
              style={{ cursor: "pointer", marginBlock: 10 }}
              onClick={async () => {
                await localStorage.removeItem("@admin");
                await localStorage.removeItem("@auth_token");
                router.push("/");
              }}
            >
              <BsBoxArrowLeft size={16} color="red" />
            </Row>
          ) : (
            <Row
              justify="center"
              style={{ cursor: "pointer", marginBlock: 10 }}
              onClick={async () => {
                await localStorage.removeItem("@admin");
                await localStorage.removeItem("@auth_token");
                router.push("/");
              }}
            >
              <BsBoxArrowLeft size={24} color="red" />
              <Typography.Title
                style={{ color: "red", marginLeft: 10 }}
                level={5}
              >
                Log Out
              </Typography.Title>{" "}
            </Row>
          )}
        </div>
      </Layout.Sider>
      <Layout style={{ backgroundColor: "#f0f2f5" }}>
        <Layout.Content>
          <div
            style={{
              margin: "24px 0px",
              padding: collapsed ? "10px" : "50px",
              height: "95vh",
              overflowY: "auto",
            }}
          >
            {props.children}
          </div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
