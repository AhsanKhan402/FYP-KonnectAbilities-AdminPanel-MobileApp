"use client";
import React, { useState } from "react";
import { Row, Button, Typography, Table, message, Input, Select } from "antd";
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
          url: `/admin/services`,
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
        url: `/admin/service-delete?serviceId=${e}`,
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
  const updateStatusMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest(process.env.NEXT_PUBLIC_URL, {
        method: "put",
        url: `/admin/service-status`,
        data,
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

  const handleStatusChange = async (value, serviceID) => {
    const data = {
      serviceId: serviceID,
      status: value,
    };
    await updateStatusMutation.mutate(data);
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
      title: "Title",
      dataIndex: "title",
      key: 3,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: 4,
    },
    {
      title: "Pick Location",
      dataIndex: "pickLocation",
      key: 5,
    },
    {
      title: "Drop Location",
      dataIndex: "dropLocation",
      key: 6,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: 7,
    },
    {
      title: "Time",
      dataIndex: "time",
      key: 8,
    },
    {
      title: "Status",
      dataIndex: "",
      key: 9,
      render: (e) => (
        <div>
          <Select
            value={e.status}
            onChange={(value) => handleStatusChange(value, e.serviceId)}
            style={{ width: 120 }}
          >
            <Select.Option value="pending">Pending</Select.Option>
            <Select.Option value="accepted">Accepted</Select.Option>
            <Select.Option value="canceled">Canceled</Select.Option>
            <Select.Option value="completed">Completed</Select.Option>
          </Select>
        </div>
      ),
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
            onClick={() => handleDelete(e.serviceId)}
            size="large"
          />
        </div>
      ),
    },
  ];

  const filteredData = userData.data?.data?.filter((user) =>
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
          Manage Services Request
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
