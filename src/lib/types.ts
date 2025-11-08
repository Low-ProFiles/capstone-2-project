export type Place = {
  id: string;
  name: string;
  desc?: string;
  lat: number;
  lng: number;
  imageUrl?: string;
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

// Mock Data
export const MOCK_USER: User = {
  id: 'user-1',
  name: '테스트 유저',
  handle: '@testuser',
  bio: '안녕하세요! 코스 공유를 좋아하는 테스트 유저입니다. 🗺️✨',
  avatarUrl: 'https://via.placeholder.com/150',
  stats: { courses: 5, likes: 128 },
};

export const MOCK_HOME_MARKERS: Place[] = [
  {
    id: 'marker-1',
    name: 'N서울타워',
    desc: '서울의 전경을 한눈에 담을 수 있는 로맨틱한 장소',
    lat: 37.551167, // N서울타워 위도
    lng: 126.988000, // N서울타워 경도
    imageUrl: 'https://via.placeholder.com/150/FF5733/FFFFFF?text=N서울타워',
    estimatedTime: '2시간',
    budget: '20,000원 (입장료, 간식 포함)',
    recommendation: '야경 감상, 케이블카 탑승',
    openingHours: '10:00 - 23:00',
    contact: '02-3456-7890',
    website: 'http://www.nseoultower.com',
  },
  {
    id: 'marker-2',
    name: '남산공원',
    desc: '도심 속 자연을 만끽할 수 있는 휴식 공간',
    lat: 37.5509, 
    lng: 126.9900,
    imageUrl: 'https://via.placeholder.com/150/33FF57/FFFFFF?text=남산공원',
    estimatedTime: '1.5시간',
    budget: '5,000원 (음료)',
    recommendation: '산책, 서울성곽길 걷기',
    openingHours: '24시간',
    contact: '02-1234-5678',
    website: 'http://parks.seoul.go.kr/namsan',
  },
  {
    id: 'marker-3',
    name: '명동',
    desc: '쇼핑과 먹거리가 가득한 활기찬 거리',
    lat: 37.5610, 
    lng: 126.9860,
    imageUrl: 'https://via.placeholder.com/150/3357FF/FFFFFF?text=명동',
    estimatedTime: '3시간',
    budget: '50,000원 (쇼핑, 식사)',
    recommendation: '길거리 음식, 화장품 쇼핑',
    openingHours: '10:00 - 22:00 (상점별 상이)',
    contact: '02-9876-5432',
    website: 'http://www.myeongdong.com',
  },
  {
    id: 'marker-4',
    name: '동대문 디자인 플라자 (DDP)',
    desc: '독특한 건축물과 다양한 전시를 즐길 수 있는 복합 문화 공간',
    lat: 37.5660,
    lng: 127.0090,
    imageUrl: 'https://via.placeholder.com/150/FFFF33/000000?text=DDP',
    estimatedTime: '2.5시간',
    budget: '10,000원 (전시 관람)',
    recommendation: '건축물 감상, 디자인 전시',
    openingHours: '10:00 - 19:00 (월요일 휴관)',
    contact: '02-2153-0000',
    website: 'http://www.ddp.or.kr',
  },
];

export const MOCK_COURSE_PLACES: Place[] = [
  {
    id: 'course-place-1',
    name: '장소 1',
    desc: '코스에 추가된 첫 번째 장소',
    lat: 37.5665, 
    lng: 126.9780,
    imageUrl: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=장소1',
    estimatedTime: '1시간',
    budget: '5,000원',
    recommendation: '조용한 분위기',
    openingHours: '09:00 - 18:00',
    contact: '02-1111-2222',
    website: 'http://place1.com',
  },
  {
    id: 'course-place-2',
    name: '장소 2',
    desc: '코스에 추가된 두 번째 장소',
    lat: 37.5700, 
    lng: 126.9800,
    imageUrl: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=장소2',
    estimatedTime: '1.5시간',
    budget: '10,000원',
    recommendation: '아름다운 경치',
    openingHours: '10:00 - 19:00',
    contact: '02-3333-4444',
    website: 'http://place2.com',
  },
  {
    id: 'course-place-3',
    name: '장소 3',
    desc: '코스에 추가된 세 번째 장소',
    lat: 37.5730,
    lng: 126.9850,
    imageUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=장소3',
    estimatedTime: '0.5시간',
    budget: '3,000원',
    recommendation: '역사적 의미',
    openingHours: '08:00 - 20:00',
    contact: '02-5555-6666',
    website: 'http://place3.com',
  },
  {
    id: 'course-place-4',
    name: '장소 4',
    desc: '코스에 추가된 네 번째 장소',
    lat: 37.5760,
    lng: 126.9900,
    imageUrl: 'https://via.placeholder.com/150/FF00FF/FFFFFF?text=장소4',
    estimatedTime: '1시간',
    budget: '7,000원',
    recommendation: '현대적인 분위기',
    openingHours: '11:00 - 21:00',
    contact: '02-7777-8888',
    website: 'http://place4.com',
  },
];

export const MOCK_COURSE: Course = {
  id: 'course-1',
  title: '서울 도심 탐방 코스',
  desc: '서울의 주요 명소를 둘러보는 코스입니다.',
  places: MOCK_COURSE_PLACES,
};

export const MOCK_COURSE_2_PLACES: Place[] = [
  {
    id: 'course-2-place-1',
    name: '경복궁',
    desc: '조선 왕조의 법궁, 아름다운 건축미와 역사를 느낄 수 있는 곳',
    lat: 37.5797,
    lng: 126.9770,
    imageUrl: 'https://via.placeholder.com/150/00FFFF/FFFFFF?text=경복궁',
    estimatedTime: '2시간',
    budget: '3,000원 (입장료)',
    recommendation: '한복 체험, 수문장 교대식',
    openingHours: '09:00 - 17:00 (화요일 휴궁)',
    contact: '02-3700-3900',
    website: 'http://www.royalpalace.go.kr',
  },
  {
    id: 'course-2-place-2',
    name: '북촌 한옥마을',
    desc: '전통 한옥이 보존된 아름다운 마을, 고즈넉한 분위기',
    lat: 37.5829,
    lng: 126.9830,
    imageUrl: 'https://via.placeholder.com/150/FFA500/FFFFFF?text=북촌',
    estimatedTime: '1.5시간',
    budget: '무료',
    recommendation: '골목길 산책, 한옥 카페',
    openingHours: '24시간 (주민 거주지이므로 조용히)',
    contact: '02-2133-1371',
    website: 'http://hanok.seoul.go.kr',
  },
  {
    id: 'course-2-place-3',
    name: '인사동 쌈지길',
    desc: '전통 공예품과 갤러리, 찻집이 어우러진 문화 거리',
    lat: 37.5736,
    lng: 126.9825,
    imageUrl: 'https://via.placeholder.com/150/800080/FFFFFF?text=인사동',
    estimatedTime: '1시간',
    budget: '15,000원 (기념품, 차)',
    recommendation: '전통 공예품 구경, 전통차 체험',
    openingHours: '10:30 - 20:30',
    contact: '02-736-0088',
    website: 'http://www.ssamziegil.com',
  },
];
export const MOCK_COURSE_2: Course = {
  id: 'course-2',
  title: '전통과 현대의 조화 코스',
  desc: '고궁과 한옥마을, 그리고 현대적인 문화 공간을 함께 즐기는 코스입니다.',
  places: MOCK_COURSE_2_PLACES,
};
