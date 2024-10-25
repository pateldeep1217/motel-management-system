"use client";
import React from "react";
import { useGetUserMotels } from "../api/use-get-user-motels";

const UserMotelsList = () => {
  const { data, error, isLoading } = useGetUserMotels();

  if (isLoading) return <p>Loading motels...</p>;
  if (error) return <p>Error fetching motels: {error.message}</p>;

  return (
    <ul>
      {data?.map((motel) => (
        <li key={motel.id}>{motel.name}</li>
      ))}
    </ul>
  );
};

export default UserMotelsList;
