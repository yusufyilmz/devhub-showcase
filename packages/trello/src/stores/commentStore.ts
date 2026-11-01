import { devtools } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";

export interface CommentReply {
  created: Date;
  id: string;
  replies?: CommentReply[];
  text: string;
  updated: Date;
  useful: boolean;
  user: {
    id: string;
    name: string;
  };
}
interface CommentStore {
  comments: CommentReply[];
  setComments: (comments: CommentReply[]) => void;
}

export const commentsStore = createWithEqualityFn<CommentStore>()(
  devtools(
    (set) => ({
      comments: [],
      setComments: (comments: CommentReply[]) => set({ comments }),
    }),
    { enabled: true },
  ),
);

export const useCommentStore = createWithEqualityFn<CommentStore>()(commentsStore);

export const commentsActions = {
  setComments: (comments: CommentReply[]) => commentsStore.setState({ comments }),
};
