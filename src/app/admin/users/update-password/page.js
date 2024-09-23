"use client";
import apiRequest from "@/context/apiRequest";
import { useMutation } from "@tanstack/react-query";
import { Button, Flex, Typography, Form, Input, Col, Row, message } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Page = () => {
  const [form] = Form.useForm();
  const router = useRouter();

  const updatePasswordMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest(process.env.NEXT_PUBLIC_URL, {
        method: "put",
        url: `/admin/update-password`,
        data,
      });

      return response;
    },
    onSuccess: async (e) => {
      if (e.status === 200) {
        message.success(e.message);
        router.back();
      } else if (e.status === 400) {
        message.error(e.message);
      }
    },
  });
  console.log("uuuu", updatePasswordMutation);

  const handleSubmit = (values) => {
    const { currentPassword, newPassword, confirmNewPassword } = values;

    if (newPassword === confirmNewPassword && newPassword !== currentPassword) {
      updatePasswordMutation.mutate(values);
    } else {
      message.error(
        "New password and confirm password must match and be different from the old password."
      );
    }
  };

  return (
    <div>
      <Flex justify="flex-start" align="middle" style={{ marginBlock: "3rem" }}>
        <Typography.Title style={{ marginBottom: 0 }}>
          Update Your Password
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
            <Col xs={23} sm={23} md={11} lg={11} xl={11} xxl={11}>
              <Form.Item
                name="currentPassword"
                rules={[
                  {
                    required: true,
                    message: "This field is mandatory!",
                  },
                ]}
                label={
                  <Typography.Text strong style={{ fontSize: 16 }}>
                    Old Password
                  </Typography.Text>
                }
              >
                <Input.Password size="large" placeholder="Current Password" />
              </Form.Item>
            </Col>
            <Row justify="space-between">
              <Col xs={23} sm={23} md={11} lg={11} xl={11} xxl={11}>
                <Form.Item
                  name="newPassword"
                  rules={[
                    {
                      required: true,
                      message: "This field is mandatory!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("currentPassword") !== value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            "New password must be different from the old password."
                          )
                        );
                      },
                    }),
                  ]}
                  label={
                    <Typography.Text strong style={{ fontSize: 16 }}>
                      New Password
                    </Typography.Text>
                  }
                >
                  <Input.Password size="large" placeholder="New Password" />
                </Form.Item>
              </Col>
              <Col xs={23} sm={23} md={11} lg={11} xl={11} xxl={11}>
                <Form.Item
                  name="confirmNewPassword"
                  rules={[
                    {
                      required: true,
                      message: "This field is mandatory!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("newPassword") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            "The new password and confirm password do not match."
                          )
                        );
                      },
                    }),
                  ]}
                  label={
                    <Typography.Text strong style={{ fontSize: 16 }}>
                      Confirm New Password
                    </Typography.Text>
                  }
                >
                  <Input.Password
                    size="large"
                    placeholder="Confirm New Password"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Button
              htmlType="submit"
              type="primary"
              size="large"
              loading={updatePasswordMutation.isPending}
            >
              Update Password
            </Button>
          </Form>
        </Col>
      </Flex>
    </div>
  );
};

export default Page;
