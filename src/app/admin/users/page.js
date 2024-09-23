"use client";
import React, { useState } from "react";
import { Row, Button, Typography, Table, message, Input } from "antd";
import { useRouter } from "next/navigation";
import { AiOutlineRight, AiTwotoneDelete, AiTwotoneEdit } from "react-icons/ai";
import { useMutation, useQuery } from "@tanstack/react-query";
import apiRequest from "@/context/apiRequest";
import moment from "moment";

const Page = () => {
  const router = useRouter();
  const [pageSize, setPageSize] = useState(10);
  const [offset, setOffset] = useState(1);
  const [searchText, setSearchText] = useState("");

  const loginUserData = JSON.parse(localStorage.getItem("@admin"));

  const userData = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await apiRequest(
        process.env.NEXT_PUBLIC_URL,
        {
          method: "get",
          url: `/admin/users`,
        },
        router
      );
      return response;
    },
  });
  console.log("dadada", userData);
  const delUserMutation = useMutation({
    mutationFn: async (e) => {
      const response = await apiRequest(process.env.NEXT_PUBLIC_URL, {
        method: "delete",
        url: `/admin/user-delete?userId=${e}`,
      });
      return response;
    },
    onSuccess: async (e) => {
      if (e.status === 200) {
        message.success(e.message);
        userData.refetch();
      } else {
        message.error(e.message);
      }
    },
  });

  const handleDelete = async (e) => {
    await delUserMutation.mutate(e);
  };

  const columns = [
    {
      title: "User Name",
      dataIndex: "username",
      key: 1,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: 2,
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: 5,
    },
    {
      title: "Disability",
      dataIndex: "disability",
      key: 6,
    },
    {
      title: "Verification Status",
      dataIndex: "",
      key: 6,
      render: (e) => (
        <div
          style={{
            color:
              e.isVerified === "verified"
                ? "green"
                : e.isVerified === "not verified"
                ? "grey"
                : "#1677ff",
            backgroundColor:
              e.isVerified === "verified"
                ? "#d4edda" // Light green background for verified
                : e.isVerified === "not verified"
                ? "lightgrey"
                : "#cae2fc",
            textTransform: "capitalize",
            padding: 5,
            borderRadius: 6,
          }}
        >
          {e.isVerified}
        </div>
      ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: 8,
      render: (created_at) => moment(created_at).format("YYYY-MM-DD, h:mma"),
    },
    {
      title: "Total Followers",
      dataIndex: "followersCount",
      key: 8,
    },
    {
      title: "Action",
      dataIndex: "",
      key: "action",
      render: (e) => (
        <div>
          <Button
            htmlType="button"
            style={{ marginLeft: 5 }}
            type="dashed"
            icon={
              <AiTwotoneDelete
                color="red"
                style={{ paddingBottom: 4 }}
                size={28}
              />
            }
            onClick={() => handleDelete(e._id)}
            size="large"
          />
          <Button
            htmlType="button"
            style={{ marginLeft: 5 }}
            type="dashed"
            icon={<AiOutlineRight style={{ paddingBottom: 4 }} size={28} />}
            size="large"
            onClick={() => router.push(`/admin/users/user/${e._id}`)}
          />
        </div>
      ),
    },
  ];

  const filteredData = userData?.data?.data?.filter((user) =>
    user?.username?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBlock: "3rem" }}
      >
        <Typography.Title style={{ marginBottom: 0 }}>
          Manage Users
        </Typography.Title>
        <div>
          {loginUserData?.isSuperAdmin ? (
            <Button
              size="large"
              type="primary"
              onClick={() => router.push("/admin/users/add-user")}
              style={{ marginRight: 10 }}
            >
              Create New Admin
            </Button>
          ) : null}
          <Button
            size="large"
            type="primary"
            onClick={() => router.push(`/admin/users/update-password`)}
          >
            Update Password
          </Button>
        </div>
      </Row>
      <Row style={{ marginBottom: "1rem" }}>
        <Input
          placeholder="Search by user name"
          value={searchText}
          size="large"
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </Row>
      <Row>
        <Table
          style={{ width: "100%" }}
          columns={columns}
          dataSource={filteredData}
          size="middle"
          scroll={{ x: true }}
          loading={userData.isLoading}
          onChange={(e) => {
            setPageSize(e.pageSize);
            setOffset(e.current);
          }}
        />
      </Row>
    </div>
  );
};

export default Page;
