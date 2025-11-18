// src/constants/regions.ts
export interface Region {
  code: string;
  name: string;
}

export const REGIONS: Region[] = [
  { code: 'SEOUL', name: '서울' },
  { code: 'BUSAN', name: '부산' },
  { code: 'DAEGU', name: '대구' },
  { code: 'INCHEON', name: '인천' },
  { code: 'GWANGJU', name: '광주' },
  { code: 'DAEJEON', name: '대전' },
  { code: 'ULSAN', name: '울산' },
  { code: 'SEJONG', name: '세종' },
  { code: 'GYEONGGI', name: '경기' },
  { code: 'GANGWON', name: '강원' },
  { code: 'CHUNGBUK', name: '충북' },
  { code: 'CHUNGNAM', name: '충남' },
  { code: 'JEONBUK', name: '전북' },
  { code: 'JEONNAM', name: '전남' },
  { code: 'GYEONGBUK', name: '경북' },
  { code: 'GYEONGNAM', name: '경남' },
  { code: 'JEJU', name: '제주' },
];
