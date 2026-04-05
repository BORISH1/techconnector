export interface Story {
  id: string;
  user_id: string;
  image_url: string;
  video_url?: string;
  created_at: string;
  expires_at: string;
  profiles?: {
    id: string;
    name: string;
    avatar_url: string;
  };
}

export interface StoryView {
  id: string;
  story_id: string;
  user_id: string;
  viewed_at: string;
}
