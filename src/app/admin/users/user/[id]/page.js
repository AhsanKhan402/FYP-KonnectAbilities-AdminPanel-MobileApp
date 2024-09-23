"use client";
import apiRequest from "@/context/apiRequest";
import {
  Button,
  Flex,
  Typography,
  Col,
  Row,
  Select,
  message,
  Divider,
} from "antd";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AiTwotoneLeftCircle } from "react-icons/ai";

const { Option } = Select;

const Page = () => {
  const params = useParams();
  const router = useRouter();

  // Fetch user data
  const userData = useQuery({
    queryKey: ["singleUser"],
    queryFn: async () => {
      const response = await apiRequest(
        process.env.NEXT_PUBLIC_URL,
        {
          method: "get",
          url: `/admin/user-id?userId=${params.id}`,
        },
        router
      );
      return response.data; // Accessing the actual data
    },
    enabled: !!params.id,
  });

  // Mutation to update the status
  const statusMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest(process.env.NEXT_PUBLIC_URL, {
        method: "put",
        url: `/admin/user-status?userId=${params.id}`,
        data,
      });
      return response;
    },
    onSuccess: (e) => {
      if (e.status === 200) {
        message.success("Status updated successfully");
        router.back();
      } else {
        message.error("Failed to update status");
      }
    },
  });

  // Handle status change
  const handleStatusChange = async (value) => {
    const data = {
      isVerified: value,
    };
    await statusMutation.mutate(data);
  };

  // Extracting user data
  const user = userData?.data;

  if (userData.isLoading) {
    return <div>Loading...</div>;
  }

  if (userData.isError) {
    return <div>Error loading user data</div>;
  }

  return (
    <div>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBlock: "3rem" }}
      >
        <Flex align="middle">
          <Button
            htmlType="button"
            style={{ marginRight: 5 }}
            type="dashed"
            size="large"
            icon={
              <AiTwotoneLeftCircle style={{ paddingBottom: 2 }} size={28} />
            }
            onClick={() => router.back()}
          />
          <Typography.Title style={{ marginBottom: 0 }}>
            User Details
          </Typography.Title>
        </Flex>
      </Row>

      <Flex>
        <Col span={14}>
          <Row>
            <Typography.Text strong style={{ marginRight: 5 }}>
              User Name:
            </Typography.Text>
            <Typography.Text>{user?.username}</Typography.Text>
          </Row>
          <Divider />

          <Row>
            <Typography.Text strong style={{ marginRight: 5 }}>
              Email:
            </Typography.Text>
            <Typography.Text>{user?.email}</Typography.Text>
          </Row>
          <Divider />

          <Row>
            <Typography.Text strong style={{ marginRight: 5 }}>
              Phone Number:
            </Typography.Text>
            <Typography.Text>{user?.phoneNumber}</Typography.Text>
          </Row>
          <Divider />

          <Row>
            <Typography.Text strong style={{ marginRight: 5 }}>
              City:
            </Typography.Text>
            <Typography.Text>{user?.city}</Typography.Text>
          </Row>
          <Divider />

          <Row>
            <Typography.Text strong style={{ marginRight: 5 }}>
              Bio:
            </Typography.Text>
            <Typography.Text>{user?.bio}</Typography.Text>
          </Row>
          <Divider />

          <Row>
            <Typography.Text strong style={{ marginRight: 5 }}>
              Disability:
            </Typography.Text>
            <Typography.Text>{user?.disability}</Typography.Text>
          </Row>
          <Divider />

          <Row>
            <Typography.Text strong style={{ marginRight: 5 }}>
              Verification Status:
            </Typography.Text>
            <Select
              value={user?.isVerified}
              onChange={handleStatusChange}
              style={{ width: 200 }}
            >
              <Option value="not verified">Not Verified</Option>
              <Option value="verify request">Verify Request</Option>
              <Option value="verified">Verified</Option>
            </Select>
          </Row>
          <Divider />

          <Row>
            <Typography.Text strong style={{ marginRight: 5 }}>
              Verification Description:
            </Typography.Text>
            <Typography.Text>{user?.verificationDescription}</Typography.Text>
          </Row>
          <Divider />

          <Row>
            <Typography.Text strong style={{ marginRight: 5 }}>
              Verification File:
            </Typography.Text>
            <Typography.Link href={user?.verificationFile} target="_blank">
              View File
            </Typography.Link>
          </Row>
          <Divider />

          <Row>
            <Typography.Text strong style={{ marginRight: 5 }}>
              Profile Image:
            </Typography.Text>
            <img
              src={user?.profileImage}
              alt="Profile"
              style={{ width: 100, height: 100, borderRadius: "50%" }}
            />
          </Row>
        </Col>
      </Flex>
    </div>
  );
};

export default Page;
