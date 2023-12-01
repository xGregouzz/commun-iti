import type { PaginationState } from "@/modules/infrastructure/models/PaginationState";
import { type Message } from "../domain/Message";

export interface MessageState {
  currentRoomMessages: Message[];
  messagesPagination: PaginationState;
}
