export type Place = {
  id: string;
  name: string;
  desc?: string;
  lat: number;
  lng: number;
  imageUrl?: string;
  spotCount?: number;
  orderNo?: number;
  estimatedTime?: string; // 예상 시간
  budget?: string; // 예산
  recommendation?: string; // 추천 메뉴/하이라이트
  openingHours?: string; // 운영 시간
  contact?: string; // 연락처
  website?: string; // 웹사이트
};

export type Course = {
  id: string;
  title: string;
  desc?: string;
  places: Place[];
};

export type User = {
  id: string;
  name: string;
  handle: string;
  bio?: string;
  avatarUrl?: string;
  stats: { courses: number; likes: number };
};

