export interface UserProfileDto {
  id: string;
  email: string;
  nickname: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
}

export interface ProfileUpdateDto {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
}
