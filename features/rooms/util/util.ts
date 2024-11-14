import { client } from "@/lib/hono";
import { InferResponseType } from "hono";

type RoomResponse = InferResponseType<(typeof client.api.rooms)["$get"], 200>;
type StatusResponse = InferResponseType<
  (typeof client.api.rooms.statuses)["$get"],
  200
>;

type Room = RoomResponse["data"][number];
type Status = StatusResponse["data"][number];

export function getRoomTypeOptions(rooms: Room[]) {
  const uniqueTypes = Array.from(new Set(rooms.map((room) => room.type)));
  return uniqueTypes.map((type) => ({
    value: type.toLowerCase(),
    label: type,
  }));
}
export function getStatusOptions(statuses: Status[]) {
  return statuses.map((status) => ({ value: status.id, label: status.status }));
}
