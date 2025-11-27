export interface UserProfileDto {
  id: string;
  email: string;
  nickname: string;
  bio?: string;
  avatarUrl?: string;
  courseCount: number;
  likeCount: number;
}

export interface ProfileUpdateDto {
  nickname?: string;
  bio?: string;
  avatarUrl?: string;
}
