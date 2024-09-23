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
          url: `/admin/posts`,
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
        url: `/admin/post-delete?postId=${e}`,
      });
      console.log("POSTID", e);
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
      dataIndex: "userInfo",
      key: 1,
      render: (userInfo) => userInfo?.username,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: 4,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: 8,
      render: (created_at) => moment(created_at).format("YYYY-MM-DD, h:mma"),
    },
    {
      title: "Total Likes",
      dataIndex: "totalLikes",
      key: 8,
    },
    {
      title: "Total Comments",
      dataIndex: "totalComments",
      key: 8,
    },
    {
      title: "Total Shares",
      dataIndex: "totalShares",
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
            onClick={() => handleDelete(e?.postId)}
            size="large"
          />
        </div>
      ),
    },
  ];

  const filteredData = userData.data?.data?.filter((post) =>
    post?.userInfo?.username?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBlock: "3rem" }}
      >
        <Typography.Title style={{ marginBottom: 0 }}>
          Manage Posts
        </Typography.Title>
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
