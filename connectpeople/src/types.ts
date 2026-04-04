export interface Profile {
  id: string;
  name: string;
  email: string;
  dob: string;
  relationship_status: string;
  job: string;
  bio: string;
  avatar_url: string;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url: string;
  created_at: string;
  profiles?: Profile;
  likes_count?: number;
  comments_count?: number;
  user_has_liked?: boolean;
}

export interface Comment {
  id: string;
  user_id: string;
  post_id: string;
  content: string;
  created_at: string;
  profiles?: Profile;
}

export interface Like {
  id: string;
  user_id: string;
  post_id: string;
  emoji: string;
}
