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
  const [adminData, setAdminData] = useState(null);
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("@adminData");
    if (stored) {
      setAdminData(JSON.parse(stored));
      setLoading(false);
      startTimer(); // Start the timer when the component mounts
    } else {
      message.error("Something Wrong !!");
      setLoading(false);
    }
  }, []);

  const startTimer = () => {
    setCanResend(false);
    setTimer(300); // Reset to 5 minutes
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true); // Enable the resend button after the timer ends
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const loginMutation = useMutation({
    mutationFn: (data) => {
      const body = {
        email: adminData.email,
        password: adminData.password,
        otp: data.otp, // Expecting the OTP field from form submission
      };
      const response = apiRequest(
        process.env.NEXT_PUBLIC_URL,
        {
          method: "post",
          url: `/admin/login`,
          data: body,
        },
        router
      );
      return response;
    },
    onSuccess: async (e) => {
      if (e.status === 200) {
        await localStorage.setItem("@admin", JSON.stringify(e.data?.user));
        await localStorage.setItem("@auth_token", e.data?.token);
        router.push("/admin/users");
      } else {
        message.error(e.message);
      }
    },
  });

  const handleSubmit = async (values) => {
    await loginMutation.mutate({ otp: values.otp });
  };

  const optMutation = useMutation({
    mutationFn: (data) => {
      const response = apiRequest(
        process.env.NEXT_PUBLIC_URL,
        {
          method: "post",
          url: `/admin/login/otp`,
          data
        },
        router
      );
      return response;
    },
    onSuccess: async (e) => {
      if (e.status === 200) {
        message.success("OTP Resent Successfully");
      } else {
        console.log("ISSSSUEEE", e);
        message.error(e.message);
      }
    },
  });

  const handleResendOTP = async () => {
    const data = {
      email: adminData.email,
      password: adminData.password
    }
    console.log("check data", data)
    await optMutation.mutate(data);
    startTimer();
  };

  return loginMutation.isPending || optMutation.isPending || loading ? (
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
          <Typography.Title>Enter OTP</Typography.Title>
          <Form
            form={form}
            name="otp-form"
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <Row justify="space-between">
              <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                <Form.Item
                  name="otp"
                  rules={[
                    {
                      required: true,
                      message: "Please input the 6-digit OTP!",
                    },
                    {
                      len: 6,
                      message: "OTP must be 6 digits!",
                    },
                  ]}
                  label={
                    <Typography.Text strong style={{ fontSize: 16 }}>
                      OTP
                    </Typography.Text>
                  }
                >
                  <Input size="large" placeholder="123456" maxLength={6} />
                </Form.Item>
              </Col>
            </Row>

            <Button
              htmlType="submit"
              type="primary"
              size="large"
              style={{ width: "100%" }}
            >
              Submit
            </Button>
          </Form>

          <Flex justify="center" style={{ marginTop: "16px" }}>
            <Typography.Text>
              {canResend ? (
                <a onClick={handleResendOTP}>Resend OTP</a>
              ) : (
                `Resend OTP in ${Math.floor(timer / 60)}:${String(
                  timer % 60
                ).padStart(2, "0")}`
              )}
            </Typography.Text>
          </Flex>
        </Card>
      </Col>
    </Flex>
  );
};

export default Page;
