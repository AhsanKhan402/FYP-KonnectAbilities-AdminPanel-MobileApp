"use client";
import apiRequest from "@/context/apiRequest";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Flex,
  Typography,
  Form,
  Input,
  Col,
  Row,
  Select,
  message,
  InputNumber,
  Spin,
} from "antd";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const Page = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loginUserData = JSON.parse(localStorage.getItem("@admin"));
      if (loginUserData?.isSuperAdmin) {
        setIsAdmin(true);
      } else {
        router.push("/admin/users");
      }
      setLoading(false);
    }
  }, [router]);

  const addUserMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest(process.env.NEXT_PUBLIC_URL, {
        method: "post",
        url: `/admin/adminUser`,
        data,
      });
      return response;
    },
    onSuccess: async (e) => {
      if (e.status === 200) {
        message.success(e.message);
        router.back();
      } else {
        message.error(e.message);
      }
    },
  });


  const handleSubmit = (e) => {
    addUserMutation.mutate(e);
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (!isAdmin) {
    return null; 
  }

  return (
    <div>
      <Flex justify="flex-start" align="middle" style={{ marginBlock: "3rem" }}>
        <Typography.Title style={{ marginBottom: 0 }}>
          Add New Admin
        </Typography.Title>
      </Flex>
      <Flex>
        <Col span={14}>
          <Form
            form={form}
            name="control-ref"
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <Row justify="space-between">
              <Col xs={23} sm={23} md={11} lg={11} xl={11} xxl={11}>
                <Form.Item
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "this field is mandatory!",
                    },
                  ]}
                  label={
                    <Typography.Text strong style={{ fontSize: 16 }}>
                      User Name
                    </Typography.Text>
                  }
                >
                  <Input size="large" placeholder="user id" />
                </Form.Item>
              </Col>
              <Col xs={23} sm={23} md={11} lg={11} xl={11} xxl={11}>
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "this field is mandatory!",
                    },
                    {
                      type: "email",
                      message: "The input is not valid E-mail!",
                    },
                  ]}
                  label={
                    <Typography.Text strong style={{ fontSize: 16 }}>
                      Email
                    </Typography.Text>
                  }
                >
                  <Input size="large" placeholder="name@domain.com" />
                </Form.Item>
              </Col>
              <Col xs={23} sm={23} md={11} lg={11} xl={11} xxl={11}>
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "this field is mandatory!",
                    },
                  ]}
                  label={
                    <Typography.Text strong style={{ fontSize: 16 }}>
                      Password
                    </Typography.Text>
                  }
                >
                  <Input.Password size="large" placeholder="Password" />
                </Form.Item>
              </Col>
             
            </Row>

            <Button
              htmlType="submit"
              type="primary"
              size="large"
              loading={addUserMutation.isPending}
            >
              Create New Admin
            </Button>
          </Form>
        </Col>
      </Flex>
    </div>
  );
};

export default Page;
