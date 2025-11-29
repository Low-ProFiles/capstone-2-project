export interface UserProfileDto {
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
