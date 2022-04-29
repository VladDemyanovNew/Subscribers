import { Post } from './post';

export interface PostFormProps {
  post?: Post;
  dialogTitle: string;
  isEditMode: boolean;
}
