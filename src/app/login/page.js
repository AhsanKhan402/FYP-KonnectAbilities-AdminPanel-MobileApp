"use client";
import apiRequest from "@/context/apiRequest";
import { useMutation } from "@tanstack/react-query";
import {
  Button,
  Card,
  Flex,
  Form,
  Typography,
  Col,
  Row,
  Input,
  Spin,
  message,
} from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const stored = localStorage.getItem("@auth_token");
    if (stored) {
      // setToken(stored);
      router.push("/admin/users");
    } else {
      router.push("/login");
      setLoading(false);
    }
  }, []);

  const loginMutation = useMutation({
    mutationFn: (data) => {
      const response = apiRequest(
        process.env.NEXT_PUBLIC_URL,
        {
          method: "post",
          url: `/admin/login/otp`,
          data,
        },
        router
      );
      return response;
    },
    onSuccess: async (e, variables) => {
      if (e.status === 200) {
        const adminData = {
          email: variables.email,
          password: variables.password,
          otpExpires: e?.otpExpires
        }
        message.success(e.message)
        await localStorage.setItem("@adminData", JSON.stringify(adminData));
        router.push("/login/otp");
      } else {
        message.error(e.message);
      }
    },
  });

  const handleSubmit = async (e) => {
    await loginMutation.mutate(e);
  };
  return loginMutation.isPending || loading ? (
    <div className="loadingContainer">
      <Spin size="large" />
    </div>
  ) : (
    <Flex
      justify="center"
      align="center"
      style={{ width: "100%", height: "100%" }}
    >
      <Col xs={22} sm={22} md={14} lg={10} xl={10} xxl={10}>
        <Card>
          <Typography.Title>Login</Typography.Title>
          <Form
            form={form}
            name="control-ref"
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <Row justify="space-between">
              <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "This field is mandatory!",
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
                  <Input size="large" placeholder="email@example.com" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "this field is mendatory!",
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
              style={{ width: "100%" }}
            >
              Log In
            </Button>
          </Form>
        </Card>
      </Col>
    </Flex>
  );
};

export default Page;
