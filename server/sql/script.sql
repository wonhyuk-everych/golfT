create table bart_exchange_rate
(
    bart_exchange_rate_idx int auto_increment comment '바트 환율 정보 IDX'
        primary key,
    bart_exchange_rate     float                               not null comment '바트 환율 정보',
    created_at             timestamp default CURRENT_TIMESTAMP null comment '생성일'
)
    comment '바트 환율 정보';

create table caddy
(
    caddy_idx          int auto_increment comment '캐디 IDX'
        primary key,
    course_idx         int                                 not null comment '소속 골프장 IDX',
    caddy_code         int                                 not null comment '캐디 코드',
    name               varchar(100)                        not null comment '캐디 이름',
    nick_name          varchar(100)                        null comment '캐디 닉네임',
    age                int                                 null comment '나이',
    height             int                                 null comment '키',
    country_code       varchar(3)                          null comment '국가 코드',
    city_code          varchar(3)                          not null comment '도시 코드',
    language           text                                null comment '구사 가능 언어',
    specialty          text                                null comment '특기',
    day_off            varchar(255)                        null comment '휴일',
    golf_experience    char(20)                            null comment '골프 경력',
    price              int       default 0                 not null comment '캐디 팁',
    reservation_fee    int       default 0                 not null comment '예약 수수료',
    caddy_status       char      default 'Y'               null comment '캐디 상태 Y/N',
    created_at         timestamp default CURRENT_TIMESTAMP null,
    created_member_idx int                                 not null,
    updated_at         timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    updated_member_idx int                                 null
)
    comment '캐디 정보 테이블';

create index caddy_country_code_city_code_index
    on caddy (country_code, city_code);

create index caddy_course_idx_index
    on caddy (course_idx);

create table caddy_image
(
    caddy_image_idx    int auto_increment comment '캐디 이미지 IDX'
        primary key,
    caddy_idx          int                                 not null comment '캐디 IDX',
    image_url          varchar(255)                        not null comment '이미지 URL',
    main_yn            char      default 'N'               not null comment '메인 유무 Y/N',
    sort               int                                 not null comment '정렬 순서',
    use_yn             char      default 'Y'               not null comment '사용 유무 Y/N',
    created_at         timestamp default CURRENT_TIMESTAMP null,
    created_member_idx int                                 not null,
    updated_at         timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    updated_member_idx int                                 null
)
    comment '캐디 이미지';

create index caddy_image_caddy_idx_use_yn_index
    on caddy_image (caddy_idx, use_yn);

create table community
(
    community_idx    int auto_increment comment '커뮤니티 IDX'
        primary key,
    country_code_idx int                                 not null comment '커뮤니티 타입 국가 코드 IDX',
    member_idx       int                                 not null comment '작성자 회원 IDX',
    title            varchar(255)                        not null comment '타이틀',
    content          text                                null comment '내용',
    use_yn           char      default 'Y'               null comment '사용 Y/N',
    created_at       timestamp default CURRENT_TIMESTAMP null
)
    comment '커뮤니티 테이블';

create index community_country_code_idx_use_yn_index
    on community (country_code_idx, use_yn);

create table community_alarm
(
    comunity_alarm_idx int auto_increment comment '커뮤니티 알람 IDX'
        primary key,
    comunity_idx       int                                 not null comment '커뮤니티 IDX',
    member_idx         int                                 not null comment '회원 IDX',
    content            varchar(100)                        not null comment '내용',
    created_at         timestamp default CURRENT_TIMESTAMP null
)
    comment '커뮤니티 알람';

create index community_alarm_member_idx_index
    on community_alarm (member_idx);

create table community_comment
(
    community_comment_idx int auto_increment comment '커뮤니티 댓글 IDX'
        primary key,
    community_idx         int                                  not null comment '커뮤니티 IDX',
    member_idx            int                                  not null comment '회원 IDX',
    content               text                                 null comment '내용',
    use_yn                varchar(1) default 'Y'               null comment '사용여부',
    created_at            timestamp  default CURRENT_TIMESTAMP null
)
    comment '커뮤니티 댓글 테이블';

create index community_comment_community_idx_use_yn_index
    on community_comment (community_idx, use_yn);

create table community_image
(
    community_image_idx int auto_increment comment '커뮤니티 이미지 IDX'
        primary key,
    community_idx       int                                  not null comment '커뮤니티 IDX',
    image_url           varchar(255)                         null comment '이미지 URL',
    sort                int                                  null comment '정렬순서',
    use_yn              varchar(1) default 'Y'               null comment '사용여부',
    created_at          timestamp  default CURRENT_TIMESTAMP null
)
    comment '커뮤니티 이미지 테이블';

create index community_image_community_idx_use_yn_index
    on community_image (community_idx, use_yn);

create table country_code
(
    country_code_idx int auto_increment comment '국가, 도시 코드 테이블'
        primary key,
    country_code     varchar(3)   not null comment '국가 코드',
    city_code        varchar(3)   not null comment '도시 코드',
    country_name     varchar(100) not null comment '국가명',
    city_name        varchar(100) not null comment '도시명',
    country_name_en  varchar(100) not null comment '영문 국가명',
    city_name_en     varchar(100) not null comment '영문 도시명',
    image_url        varchar(255) not null comment '도시 메인 이미지'
)
    comment '국가 코드, 도시 코드 테이블';

create index country_code_country_code_city_code_index
    on country_code (country_code, city_code);

create table event
(
    event_idx          int auto_increment comment '이벤트 IDX'
        primary key,
    title              varchar(255)                       not null comment '이벤트 타이틀',
    start_date         date                               not null comment '이벤트 시작 날짜',
    end_date           date                               not null comment '이벤트 종료날짜',
    event_status       char     default 'Y'               not null comment '이벤트 노출 Y/N',
    created_at         datetime default CURRENT_TIMESTAMP null,
    created_member_idx int                                not null,
    updated_at         datetime                           null on update CURRENT_TIMESTAMP,
    updated_member_idx int                                null
)
    comment '이벤트 테이블';

create index event_start_date_end_date_event_status_index
    on event (start_date, end_date, event_status);

create table event_image
(
    event_image_idx    int auto_increment comment '이벤트 이미지 IDX'
        primary key,
    event_idx          int                                not null comment '이벤트 IDX',
    image_url          varchar(255)                       not null comment '이미지 URL',
    main_yn            char     default 'N'               not null comment '메인 Y/N',
    sort               int      default 0                 not null comment '정렬',
    use_yn             char     default 'Y'               not null comment '사용 유무 Y/N',
    created_at         datetime default CURRENT_TIMESTAMP null,
    created_member_idx int                                not null,
    updated_at         datetime                           null on update CURRENT_TIMESTAMP,
    updated_member_idx int                                null
)
    comment '이벤트 이미지';

create index event_image_event_idx_use_yn_index
    on event_image (event_idx, use_yn);

create table golf_course
(
    course_idx         int auto_increment comment '골프장 IDX'
        primary key,
    booking_status     char      default 'N'               null comment '예약상태',
    course_status      char      default 'Y'               null comment '골프장 상태',
    course_id          varchar(10)                         null comment '골프장 ID',
    name_kr            varchar(255)                        not null comment '골프장명 한글',
    name_en            varchar(255)                        null comment '골프장명 영문',
    country_code       varchar(3)                          null comment '국가코드',
    city_code          varchar(3)                          null comment '도시코드',
    hole_count         int                                 null comment '홀수',
    round_start        char      default 'N'               null comment '라운드 시작',
    address            varchar(255)                        null comment '주소',
    phone              varchar(20)                         null comment '전화번호',
    fax                varchar(50)                         null comment '팩스 번호',
    website            varchar(255)                        null comment '홈페이지',
    course_designer    text                                null comment '코스 디자이너',
    course_holes       varchar(10)                         null comment '코스 정보 홀',
    course_par         varchar(10)                         null comment '코스 정보 파',
    course_length      varchar(10)                         null comment '코스 정보 길이',
    course_info        text                                null comment '코스 정보',
    price_option       char                                null comment 'L : 럭셔리, H: 상급, N: 가성비',
    difficulty         int                                 null comment '난이도 상 : 3, 중 : 2, 하 : 1',
    night_golf_yn      char      default 'N'               not null comment '밤 골프 Y/N',
    fairway_info       varchar(100)                        null comment '그린정보 페어웨이',
    green_info         varchar(100)                        null comment '그린정보 그린',
    nearest_airport    varchar(100)                        null comment '근처 공항',
    airport_time       int                                 null comment '공항 소요 시간',
    nearest_city       varchar(100)                        null comment '근처 시내',
    city_time          int                                 null comment '시내 소요 시간',
    max_golfer         int                                 null comment '최대 인원수',
    single_play        char      default 'N'               null comment '1인 플레이',
    single_play_date   varchar(50)                         null comment '1인 플레이 날짜',
    double_play        char      default 'N'               null comment '2인 플레이',
    double_play_date   varchar(50)                         null comment '2인 플레이 날짜',
    map_url            varchar(255)                        null comment '지도 URL',
    promotion_url      varchar(255)                        null comment '홍보 URL',
    description        text                                null comment '상세 설명',
    facility_info      text charset utf8mb4                null,
    created_at         timestamp default CURRENT_TIMESTAMP null,
    created_member_idx int                                 null,
    updated_at         timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    updated_member_idx int                                 null
)
    comment '골프장 정보';

create index golf_course_booking_status_course_status_index
    on golf_course (booking_status, course_status);

create index idx_region
    on golf_course (country_code, city_code);

create table golf_course_exception_price
(
    golf_exception_price_idx int auto_increment comment '특정 날짜 가격 IDX'
        primary key,
    golf_monthly_price_idx   int                                 not null comment '월별 가격 IDX',
    course_idx               int                                 not null comment '골프장 IDX',
    exception_date           date                                not null comment '특정 날짜',
    start_time               time                                not null comment '시작 시간',
    end_time                 time                                not null comment '종료 시간',
    price                    int                                 not null comment '가격',
    use_yn                   char      default 'Y'               not null comment '사용 유무(Y/N)',
    created_at               timestamp default CURRENT_TIMESTAMP null,
    created_member_idx       int                                 not null,
    updated_at               timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    updated_member_idx       int                                 null
)
    comment '특정 날짜 기본 가격';

create index golf_course_exception_price_exception_date_index
    on golf_course_exception_price (exception_date);

create index golf_course_exception_price_idx_exception_date_index
    on golf_course_exception_price (golf_monthly_price_idx, course_idx, exception_date);

create index golf_course_exception_price_start_time_end_time_index
    on golf_course_exception_price (start_time, end_time);

create table golf_course_extra_image
(
    image_idx  int auto_increment comment '이미지 IDX'
        primary key,
    course_idx int                                 null comment '골프장 IDX',
    image_url  varchar(255)                        null comment '이미지 URL',
    image_type varchar(50)                         null comment '이미지 타입',
    created_at timestamp default CURRENT_TIMESTAMP null,
    updated_at timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP
)
    comment '골프장 기타 이미지 정보';

create table golf_course_facility
(
    course_idx             int                                  not null comment '골프장 IDX',
    golf_facility_type_idx int                                  not null comment '골프장 주요 시설 IDX',
    use_yn                 varchar(1) default 'Y'               null comment '사용여부',
    created_at             timestamp  default CURRENT_TIMESTAMP null,
    created_member_idx     int                                  not null comment '생성자 아이디',
    updated_at             timestamp  default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    updated_member_idx     int                                  null comment '수정자 아이디',
    primary key (course_idx, golf_facility_type_idx)
)
    comment '골프장 주요 시설 테이블';

create table golf_course_image
(
    image_idx             int auto_increment comment '이미지 IDX'
        primary key,
    course_idx            int                                 null comment '골프장 IDX',
    logo_url              varchar(255)                        null comment '골프장 로고',
    main_image_url        varchar(255)                        null comment '메인 이미지',
    course_image_url      varchar(255)                        null comment '코스 이미지',
    clubhouse_image_url   varchar(255)                        null comment '클럽하우스 이미지',
    restaurant_image_url  varchar(255)                        null comment '레스토랑 이미지',
    shelter_image_url     varchar(255)                        null comment '그늘집 이미지',
    proshop_image_url     varchar(255)                        null comment '프로샵 이미지',
    description_image_url varchar(255)                        null comment '골프장 설명 이미지',
    created_at            timestamp default CURRENT_TIMESTAMP null,
    updated_at            timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP
)
    comment '골프장 이미지 정보';

create index golf_course_image_course_idx_index
    on golf_course_image (course_idx);

create table golf_course_location
(
    golf_course_location_idx int auto_increment comment '골프장 주변 위치 정보 IDX'
        primary key,
    course_idx               int                                 not null comment '골프장 IDX',
    location                 varchar(255)                        not null comment '지역 이름',
    address                  text                                not null comment '콜밴 위치정보',
    use_yn                   char      default 'Y'               not null comment '사용 유무(Y/N)',
    created_at               timestamp default CURRENT_TIMESTAMP null,
    created_member_idx       int                                 not null,
    updated_at               timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    updated_member_idx       int                                 null
)
    comment '골프장 주변 정보 (콜밴 위치정보 용도)';

create index golf_course_location_course_idx_use_yn_index
    on golf_course_location (course_idx, use_yn);

create table golf_course_monthly_price
(
    golf_monthly_price_idx  int auto_increment comment '월별 가격 IDX'
        primary key,
    course_idx              int                                 not null comment '골프장 IDX',
    target_year             int                                 not null comment '적용 연도',
    target_month            int                                 not null comment '적용 월(1-12)',
    min_price               int                                 not null comment '해당 월 노출 가격',
    caddy_fee               int                                 null comment '캐디피 정상가',
    caddy_sale_fee          int                                 null comment '캐디피 판매가',
    cart_fee                int                                 null comment '카트피 정상가',
    cart_sale_fee           int                                 null comment '카트피 판매가',
    call_suv_one_way_fee    int                                 null comment '콜밴(SUV) 편도 가격',
    call_suv_round_trip_fee int                                 null comment '콜밴(SUV) 왕복 가격',
    call_van_one_way_fee    int                                 null comment '콜밴(VAN) 편도 가격',
    call_van_round_trip_fee int                                 null comment '콜밴(VAN) 왕복 가격',
    refund_policy           text                                null comment '환불 정책',
    cancel_policy           text                                null comment '취소 정책',
    minimum_person          int                                 null comment '최소 예약 인원',
    use_yn                  char      default 'Y'               not null comment '사용 유무(Y/N)',
    created_at              timestamp default CURRENT_TIMESTAMP null,
    created_member_idx      int                                 not null,
    updated_at              timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    updated_member_idx      int                                 null,
    constraint golf_course_monthly_price_course_idx_uindex
        unique (course_idx, target_year, target_month, use_yn)
)
    comment '골프장 월별 기본 가격';

create index golf_course_monthly_price_target_year_target_month_index
    on golf_course_monthly_price (target_year, target_month);

create table golf_course_price
(
    price_idx              int auto_increment comment '가격 IDX'
        primary key,
    course_idx             int                                 null comment '골프장 IDX',
    weekday_green_fee      int                                 null comment '그린피 주중 정상가',
    weekday_green_sale_fee int                                 null comment '그린피 주중 판매가',
    weekend_green_fee      int                                 null comment '그린피 주말 정상가',
    weekend_green_sale_fee int                                 null comment '그린피 주말 판매가',
    caddy_fee              int                                 null comment '캐디피 정상가',
    caddy_sale_fee         int                                 null comment '캐디피 판매가',
    cart_fee               int                                 null comment '카트피 정상가',
    cart_sale_fee          int                                 null comment '카트피 판매가',
    call_van_fee           int                                 null comment '콜밴 가격',
    total_fee              int                                 null comment '전체 요금',
    created_at             timestamp default CURRENT_TIMESTAMP null,
    created_member_idx     int                                 not null,
    updated_at             timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    updated_member_idx     int                                 null
)
    comment '골프장 가격 정보';

create table golf_course_time_price
(
    golf_time_price_idx    int auto_increment comment '시간별 가격 IDX'
        primary key,
    golf_monthly_price_idx int                                 not null comment '월별 가격 IDX',
    course_idx             int                                 not null comment '골프장 IDX',
    day_of_week            int                                 not null comment '요일(0=일요일, 1=월요일, 6=토요일)',
    start_time             time                                not null comment '시작 시간',
    end_time               time                                not null comment '종료 시간',
    price                  int                                 not null comment '가격',
    use_yn                 char      default 'Y'               not null comment '사용 유무(Y/N)',
    created_at             timestamp default CURRENT_TIMESTAMP null,
    created_member_idx     int                                 not null,
    updated_at             timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    updated_member_idx     int                                 null
)
    comment '골프장 시간별 기본 가격';

create index golf_course_time_price_golf_time_price_idx_day_of_week_index
    on golf_course_time_price (golf_time_price_idx, day_of_week);

create index golf_course_time_price_start_time_end_time_index
    on golf_course_time_price (start_time, end_time);

create table golf_facility_type
(
    golf_facility_type_idx int auto_increment comment '골프장 주요 시설 IDX'
        primary key,
    icon_name              varchar(100)                         not null comment '노출 되는 아이콘 이름',
    use_yn                 varchar(1) default 'Y'               null comment '사용 YN',
    created_at             timestamp  default CURRENT_TIMESTAMP null,
    created_member_idx     int                                  not null,
    updated_at             timestamp  default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    updated_member_idx     int                                  null
)
    comment '골프장 주요 시설';

create table hotel
(
    hotel_idx          int auto_increment comment '호텔 IDX'
        primary key,
    name_kr            varchar(255)                        not null comment '호텔명 한글',
    name_en            varchar(255)                        null comment '호텔명 영문',
    country_code       varchar(3)                          not null comment '국가코드',
    city_code          varchar(3)                          not null comment '도시 코드',
    grade              int                                 null comment '호텔 등급',
    check_in           int                                 not null comment '체크인 시간',
    check_out          int                                 not null comment '체크 아웃 시간',
    address            text collate utf8mb4_unicode_ci     null,
    home_page          varchar(255)                        null comment '홈페이지 주소',
    hotel_status       char      default 'Y'               null comment '호텔 상태',
    created_at         timestamp default CURRENT_TIMESTAMP null,
    created_member_idx int                                 not null,
    updated_at         timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    updated_member_idx int                                 null
)
    comment '호텔 테이블';

create index hotel_country_code_city_code_index
    on hotel (country_code, city_code);

create index hotel_hotel_idx_hotel_status_index
    on hotel (hotel_idx, hotel_status);

create table hotel_exception_price
(
    hotel_exception_price_idx int auto_increment comment '특정 날짜 가격 IDX'
        primary key,
    hotel_monthly_price_idx   int                                 not null comment '월별 가격 IDX',
    hotel_idx                 int                                 not null comment '호텔 IDX',
    hotel_room_idx            int                                 not null comment '호텔룸 IDX',
    exception_date            date                                not null comment '특정 날짜',
    price                     int                                 not null comment '가격',
    use_yn                    char      default 'Y'               not null comment '사용 유무(Y/N)',
    created_at                timestamp default CURRENT_TIMESTAMP null,
    created_member_idx        int                                 not null,
    updated_at                timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    updated_member_idx        int                                 null
)
    comment '특정 날짜 기본 가격';

create index hotel_exception_price_exception_date_index
    on hotel_exception_price (exception_date);

create index hotel_exception_price_idx_exception_date_index
    on hotel_exception_price (hotel_monthly_price_idx, hotel_idx, hotel_room_idx, exception_date);

create table hotel_facility
(
    hotel_idx               int                                 not null comment '호텔 IDX',
    hotel_facility_type_idx int                                 not null comment '서비스 IDX',
    use_yn                  char      default 'Y'               null comment '사용 Y/N',
    created_at              timestamp default CURRENT_TIMESTAMP null,
    created_member_idx      int                                 not null comment '생성자 IDX',
    updated_at              timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    updated_member_idx      int                                 null comment '수정자 IDX',
    primary key (hotel_idx, hotel_facility_type_idx)
)
    comment '호텔, 룸 시설 / 서비스';

create table hotel_facility_type
(
    hotel_facility_type_idx int auto_increment comment '호텔 시설, 서비스 IDX'
        primary key,
    facility_type           char                                not null comment '호텔 시설, 서비스 타입 (H: 호텔 시설/ 서비스, R: 객실 시설 / 서비스, E: 유료 옵션',
    created_at              timestamp default CURRENT_TIMESTAMP null,
    created_member_idx      int                                 not null comment '생성자 아이디',
    updated_at              timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    updated_member_idx      int                                 null comment '삭제자 아이디'
)
    comment '호텔 시설, 서비스';

create table hotel_image
(
    hotel_image_idx    int auto_increment comment '호텔 이미지 IDX'
        primary key,
    hotel_idx          int                                  not null comment '호텔 IDX',
    hotel_room_idx     int                                  null comment '호텔 룸 이미지일 경우 호텔 룸 IDX',
    image_url          varchar(255)                         null comment '이미지 URL',
    image_type         varchar(50)                          null comment '이미지 타입',
    sort               int                                  null comment '정렬순서',
    main_yn            varchar(1) default 'N'               null comment '메인이미지여부',
    use_yn             varchar(1) default 'Y'               null comment '사용여부',
    created_at         timestamp  default CURRENT_TIMESTAMP null,
    created_member_idx int                                  not null,
    updated_at         timestamp  default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    updated_member_idx int                                  null
)
    comment '호텔 이미지 테이블';

create index hotel_image_hotel_idx_hotel_room_idx_use_yn_index
    on hotel_image (hotel_idx, hotel_room_idx, use_yn);

create index hotel_image_hotel_idx_use_yn_index
    on hotel_image (hotel_idx, use_yn);

create table hotel_info
(
    hotel_info_idx              int auto_increment comment '호텔 정보 IDX'
        primary key,
    hotel_idx                   int                                    not null comment '호텔 IDX',
    pay_info                    text                                   null comment '결제 안내 문구',
    refund_info                 text                                   null comment '교환 환불 안내',
    service_info                text                                   null comment '서비스 문의',
    hotel_facility_info         text charset utf8mb4                   null comment '호텔 시설 및 서비스',
    room_facility_info          text charset utf8mb4                   null comment '호텔 룸 시설 및 서비스',
    pay_caution_check_image_url varchar(255)                           null comment '상품 결제전 확인 이미지',
    language                    varchar(100) default 'KR'              null comment '언어',
    created_at                  timestamp    default CURRENT_TIMESTAMP null,
    created_member_idx          int                                    not null,
    updated_at                  timestamp    default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    updated_member_idx          int                                    null
)
    comment '호텔 추가 정보 테이블';

create index hotel_info_hotel_idx_index
    on hotel_info (hotel_idx);

create table hotel_monthly_price
(
    hotel_price_idx    int auto_increment comment '월별 가격 IDX'
        primary key,
    hotel_idx          int                                 not null comment '호텔 IDX',
    hotel_room_idx     int                                 not null comment '호텔룸 IDX',
    target_year        int                                 not null comment '적용 연도',
    target_month       int                                 not null comment '적용 월(1-12)',
    min_price          int                                 not null comment '해당 월 노출 가격',
    use_yn             char      default 'Y'               not null comment '사용 유무(Y/N)',
    created_at         timestamp default CURRENT_TIMESTAMP null,
    created_member_idx int                                 not null,
    updated_at         timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    updated_member_idx int                                 null
)
    comment '호텔 월별 기본 가격';

create index hotel_monthly_price_target_year_target_month_index
    on hotel_monthly_price (target_year, target_month);

create table hotel_paid_service
(
    hotel_paid_service_idx int auto_increment comment '호텔 유료 서비스 IDX'
        primary key,
    hotel_idx              int                                 not null comment '호텔 IDX',
    service_name           varchar(255)                        not null comment '서비스 명',
    service_name_en        varchar(255)                        not null comment '서비스 명 영문',
    price                  int                                 not null comment '서비스 가격',
    use_yn                 char      default 'Y'               null comment '사용여부',
    created_at             timestamp default CURRENT_TIMESTAMP null,
    created_member_idx     int                                 null comment '생성자 IDX',
    updated_at             timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    updated_member_idx     int                                 null comment '삭제자 IDX'
)
    comment '호텔 유료 서비스';

create index hotel_paid_service_hotel_idx_use_yn_index
    on hotel_paid_service (hotel_idx, use_yn);

create table hotel_room
(
    hotel_room_idx     int auto_increment comment '호텔 룸  IDX'
        primary key,
    hotel_idx          int                                 not null comment '호텔 IDX',
    room_name          varchar(255)                        not null comment '호텔 룸명',
    room_name_en       varchar(255)                        null comment '호텔 룸명 영문',
    adult              int                                 null comment '최대 성인 예약 수',
    children           int                                 null comment '최대 아동 예약 수',
    room_product_price int                                 null comment '호텔 룸 상품 가격',
    room_sale_price    int                                 null comment '호텔 룸 판매 가격',
    refund_yn          char      default 'N'               null comment '취소여부',
    view_type          varchar(100)                        null comment '뷰 종류',
    bed_type           varchar(100)                        null comment '침대 배드 종류',
    breakfast_yn       char      default 'N'               null comment '조식여부',
    use_yn             char      default 'Y'               null comment '사용여부',
    created_at         timestamp default CURRENT_TIMESTAMP null,
    created_member_idx int                                 null comment '생성자 IDX',
    updated_at         timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    updated_member_idx int                                 null comment '삭제자 IDX'
)
    comment '호텔 룸 정보 테이블';

create index hotel_room_hotel_idx_use_yn_index
    on hotel_room (hotel_idx, use_yn);

create table hotel_room_facility
(
    hotel_room_facility_idx int auto_increment comment '호텔 방 서비스 IDX'
        primary key,
    hotel_room_idx          int                                 not null comment '호텔 방 IDX',
    hotel_facility_type_idx int                                 not null comment '서비스 IDX',
    use_yn                  char      default 'Y'               null comment '사용 Y/N',
    created_at              timestamp default CURRENT_TIMESTAMP null,
    created_member_idx      int                                 not null comment '생성자 IDX',
    updated_at              timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    updated_member_idx      int                                 null comment '수정자 IDX'
)
    comment '호텔, 룸 시설 / 서비스';

create index hotel_room_facility_hotel_room_idx_use_yn_index
    on hotel_room_facility (hotel_room_idx, use_yn);

create table hotel_week_price
(
    hotel_time_price_idx    int auto_increment comment '요일별 가격 IDX'
        primary key,
    hotel_monthly_price_idx int                                 not null comment '월별 가격 IDX',
    hotel_idx               int                                 not null comment '호텔 IDX',
    hotel_room_idx          int                                 not null comment '호텔룸 IDX',
    day_of_week             int                                 not null comment '요일(0=일요일, 1=월요일, 6=토요일)',
    price                   int                                 not null comment '가격',
    use_yn                  char      default 'Y'               not null comment '사용 유무(Y/N)',
    created_at              timestamp default CURRENT_TIMESTAMP null,
    created_member_idx      int                                 not null,
    updated_at              timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    updated_member_idx      int                                 null
)
    comment '호텔 요일별 기본 가격';

create index hotel_week_price_hotel_room_idx_use_yn_index
    on hotel_week_price (hotel_room_idx, use_yn);

create table locale_text
(
    locale_text_idx    int auto_increment comment '공통 언어 텍스트 IDX'
        primary key,
    target_idx         int                                  not null comment '연동 테이블 IDX',
    target_category    varchar(255)                         not null comment '연동 카테고리',
    text               varchar(255)                         null comment '일반 텍스트',
    long_text          text collate utf8mb4_unicode_ci      null,
    language           varchar(2) default 'KO'              null comment '언어(KO, EN)',
    use_yn             char       default 'Y'               null comment '사용 유무 Y/N',
    created_at         timestamp  default CURRENT_TIMESTAMP null comment '생성일',
    created_member_idx int                                  not null comment '생성자',
    updated_at         timestamp                            null on update CURRENT_TIMESTAMP,
    updated_member_idx int                                  null
)
    comment '공통 언어별 텍스트';

create index locale_text_target_idx_target_category_index
    on locale_text (target_idx, target_category);

create table member
(
    member_idx    int auto_increment comment '회원 아이디'
        primary key,
    id            varchar(500)                        not null comment '아이디',
    password      varchar(255)                        not null comment '비밀번호',
    grade         char      default 'M'               not null comment '회원 등급 (M : 일반 회원, A: 관리자)',
    birthday      varchar(100)                        null comment '생년월일',
    gender        varchar(50)                         null comment '성별',
    email         varchar(500)                        null comment '이메일',
    name_kr       varchar(100)                        null comment '고객명(한글)',
    name_en       varchar(100)                        null comment '고객명(영문)',
    phone         varchar(100)                        null comment '휴대전화',
    member_status char      default 'Y'               null comment '회원 상태',
    created_at    timestamp default CURRENT_TIMESTAMP null,
    updated_at    timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    constraint id
        unique (id)
)
    comment '회원 정보';

create index idx_member_email
    on member (email);

create index idx_member_phone
    on member (phone);

create table notice
(
    notice_idx         int auto_increment comment '공지사항 IDX'
        primary key,
    notice_type        char                                not null comment '공지사항 타입 N(공지사항), R(예약), T(대회), E(이벤트)',
    title              varchar(255)                        not null comment '타이틀',
    content            text                                null comment '내용',
    use_yn             char      default 'Y'               null comment '사용 Y/N',
    created_at         timestamp default CURRENT_TIMESTAMP null,
    created_member_idx int                                 not null,
    updated_at         timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    updated_member_idx int                                 null
)
    comment '공지사항 테이블';

create table notice_image
(
    notice_image_idx int auto_increment comment '공지사항 이미지 IDX'
        primary key,
    notice_idx       int                                  not null comment '공지사항 IDX',
    image_url        varchar(255)                         null comment '이미지 URL',
    sort             int                                  null comment '정렬순서',
    use_yn           varchar(1) default 'Y'               null comment '사용여부',
    created_at       timestamp  default CURRENT_TIMESTAMP null
)
    comment '공지사항 이미지 테이블';

create index notice_image_notice_idx_use_yn_index
    on notice_image (notice_idx, use_yn);

create table qna
(
    qna_idx           int auto_increment comment 'QnA IDX'
        primary key,
    qna_type_idx      int                                not null comment 'QnA 타입 IDX',
    member_idx        int                                not null comment '회원 IDX',
    title             varchar(255)                       not null comment '제목',
    content           text                               not null comment '내용',
    phone             varchar(100)                       not null comment '전화번호',
    email             varchar(255)                       null comment '이메일',
    password          varchar(255)                       null comment 'QnA 비밀번호',
    answer            text                               null comment '답변',
    answer_date       datetime                           null comment '답변한 날짜',
    answer_member_idx int                                null comment '답변자 IDX',
    answer_status     char     default 'W'               not null comment '답변 상태 W: 답변 대기, C: 답변 완료',
    terms_agree_date  datetime default CURRENT_TIMESTAMP null comment '약관 동의한 날짜',
    created_at        datetime default CURRENT_TIMESTAMP null,
    updated_at        datetime                           null on update CURRENT_TIMESTAMP
)
    comment 'QnA 테이블';

create index qna_qna_type_idx_index
    on qna (qna_type_idx);

create table qna_image
(
    qna_image_idx int auto_increment comment 'QnA 이미지 IDX'
        primary key,
    qna_idx       int                                 not null comment 'QnA IDX',
    image_url     varchar(255)                        null comment '이미지 URL',
    created_at    timestamp default CURRENT_TIMESTAMP null
)
    comment 'QnA 이미지 테이블';

create index qna_image_qna_idx_index
    on qna_image (qna_idx);

create table qna_type
(
    qna_type_idx int auto_increment comment 'QnA 타입 IDX'
        primary key,
    name_kr      varchar(100)                        not null comment '한글명',
    name_en      varchar(100)                        not null comment '영문명',
    created_at   timestamp default CURRENT_TIMESTAMP null,
    updated_at   timestamp                           null on update CURRENT_TIMESTAMP
)
    comment 'QnA 타입';

create table recommend_product
(
    recommend_product_idx int auto_increment comment '상품 추천 IDX'
        primary key,
    recommend_type        varchar(50)                         not null comment '추천 타입(best30, golf, hotel, caddy)',
    product_idx           int                                 not null comment '상품 IDX',
    product_type          varchar(50)                         not null comment '상품 타입 (golf, hotel, caddy)',
    sort                  int                                 null comment '정렬 순서',
    created_at            timestamp default CURRENT_TIMESTAMP null,
    created_member_idx    int                                 null,
    updated_at            timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    updated_member_idx    int                                 null
)
    comment '추천 테이블';

create table reservation_caddy
(
    reservation_caddy_idx int auto_increment comment '예약 캐디 IDX'
        primary key,
    reservation_idx       varchar(50)                           not null comment '예약번호',
    caddy_idx             int                                   not null comment '캐디 IDX',
    course_idx            int                                   not null comment '골프장 IDX',
    member_idx            int                                   not null comment '회원 정보 IDX',
    reservation_date      date                                  not null comment '예약 날짜',
    golf_course_time      int                                   not null comment '예약 시간',
    total_price           int                                   not null comment '총 가격',
    reservation_status    varchar(50) default 'PENDING'         not null comment '결제 상태',
    cancel_reason         varchar(255)                          null comment '부분 취소일 경우 사유',
    create_date           datetime    default CURRENT_TIMESTAMP null,
    update_date           datetime                              null on update CURRENT_TIMESTAMP
)
    comment '예약 캐디';

create index reservation_caddy_member_idx_index
    on reservation_caddy (member_idx);

create table reservation_callvan
(
    reservation_callvan_idx int auto_increment comment '예약 콜밴 IDX'
        primary key,
    reservation_idx         varchar(50)                           not null comment '예약번호',
    course_idx              int                                   not null comment '골프장 IDX',
    member_idx              int                                   not null comment '회원 정보 IDX',
    car_type                varchar(5)                            not null comment '콜밴 타입 (SUV, VAN)',
    start_date              date                                  null comment '출발 예약 날짜',
    start_time              varchar(50)                           null comment '출발 예약 시간',
    pickup_location         varchar(255)                          not null comment '출발 지역명',
    dropoff_location        varchar(255)                          not null comment '도착 지역명',
    end_date                date                                  null comment '도착 예약 날짜',
    end_time                varchar(50)                           null comment '도착 예약 시간',
    round_trip_yn           char                                  not null comment '왕복 (Y), 편도(N)',
    number_of_reservation   int                                   null comment '예약 탑승 인원',
    number_of_call_van      int                                   not null comment '예약 콜밴 대수',
    total_price             int                                   not null comment '총 가격',
    reservation_status      varchar(50) default 'PENDING'         not null comment '결제 상태',
    cancel_reason           varchar(255)                          null comment '부분 취소일 경우 사유',
    create_date             datetime    default CURRENT_TIMESTAMP null,
    update_date             datetime                              null on update CURRENT_TIMESTAMP
)
    comment '예약 콜밴';

create index reservation_call_van_member_idx_index
    on reservation_callvan (member_idx);

create table reservation_cancel
(
    reservation_history_idx int auto_increment comment '예약 취소 히스토리 IDX'
        primary key,
    reservation_idx         varchar(50)                         not null comment '예약 IDX',
    reservation_type_idx    int                                 not null comment '각 타입의 IDX ',
    cancel_type             varchar(10)                         not null comment '취소 타입 (ALL, GOLF, HOTEL, CADDY, TOURNAMENT)',
    cancel_reason           varchar(255)                        not null comment '취소 사유',
    cancel_amount           int                                 not null comment '취소 금액',
    cancel_data             text                                not null comment '취소 결과 데이터',
    created_at              timestamp default CURRENT_TIMESTAMP null,
    created_member_idx      int                                 not null,
    updated_at              timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    updated_member_idx      int                                 null
)
    comment '예약 취소 히스토리 테이블';

create index reservation_cancel_reservation_idx_index
    on reservation_cancel (reservation_idx);

create table reservation_golf
(
    reservation_golf_idx     int auto_increment comment '예약 골프장 IDX'
        primary key,
    reservation_idx          varchar(50)                           not null comment '예약번호',
    course_idx               int                                   not null comment '골프장 IDX',
    member_idx               int                                   not null comment '회원 정보 IDX',
    reservation_date         date                                  not null comment '예약 날짜',
    number_of_reservation    int                                   not null comment '예약 인원',
    number_of_call_van       int                                   null comment '콜밴 예약 대수',
    car_type                 varchar(5)                            null comment '카 타입(SUV, VAN)',
    round_trip_yn            char                                  null comment '왕복 (Y), 편도(N)',
    dropoff_location         varchar(255)                          null comment '도착 지역명',
    pickup_location          varchar(255)                          null comment '출발 지역명',
    golf_monthly_price_idx   int                                   not null comment '월별 가격 IDX',
    golf_time_price_idx      int                                   null comment '시간별 가격 IDX',
    golf_exception_price_idx int                                   null comment '특정 날짜 가격 IDX',
    golf_price_type          varchar(10)                           not null comment '가격 타입 (exception, weekday)',
    golf_course_sale_fee     int                                   not null comment '그린피',
    cart_sale_fee            int                                   not null comment '카트 피',
    caddy_sale_fee           int                                   not null comment '캐디 피',
    callvan_sale_fee         int                                   null comment '콜밴 피',
    total_price              int                                   not null comment '총 가격',
    reservation_status       varchar(50) default 'PENDING'         not null comment '결제 상태',
    cancel_reason            varchar(255)                          null comment '부분 취소일 경우 사유',
    create_date              datetime    default CURRENT_TIMESTAMP null,
    update_date              datetime                              null on update CURRENT_TIMESTAMP
)
    comment '예약 골프장';

create index reservation_golf_member_idx_index
    on reservation_golf (member_idx);

create table reservation_hotel
(
    reservation_hotel_idx int auto_increment comment '예약 호텔 IDX'
        primary key,
    reservation_idx       varchar(50)                           not null comment '예약번호',
    hotel_idx             int                                   not null comment '호텔 IDX',
    member_idx            int                                   not null comment '회원 정보 IDX',
    check_in_date         date                                  not null comment '체크인 날짜',
    check_out_date        date                                  not null comment '체크아웃 날짜',
    hotel_room_idx        int                                   not null comment '예약한 호텔 방 IDX',
    number_of_room        int                                   not null comment '예약한 객실 수',
    number_of_reservation int                                   null comment '예약 인원',
    adult                 int                                   not null comment '성인',
    children              int                                   not null comment '아동',
    paid_services         varchar(255)                          null comment '유료 서비스',
    total_price           int                                   not null comment '총 가격',
    reservation_status    varchar(50) default 'PENDING'         not null comment '결제 상태',
    cancel_reason         varchar(255)                          null comment '부분 취소일 경우 사유',
    create_date           datetime    default CURRENT_TIMESTAMP null,
    update_date           datetime                              null on update CURRENT_TIMESTAMP
)
    comment '예약 호텔';

create index reservation_hotel_member_idx_index
    on reservation_hotel (member_idx);

create table reservation_master
(
    reservation_idx    varchar(50)                           not null comment '예약번호'
        primary key,
    toss_payment_key   varchar(50)                           null comment '토스 결제 키',
    reservation_status varchar(50) default 'PENDING'         not null comment '예약상태',
    reservation_type   varchar(50)                           not null comment '예약 서비스',
    member_idx         int                                   null comment '예약한 회원 ID',
    first_name         varchar(100)                          not null comment '성',
    last_name          varchar(100)                          not null comment '이름',
    email              varchar(255)                          not null comment '이메일',
    phone_number       varchar(100)                          not null comment '전화번호',
    pay_type           varchar(50)                           not null comment '결제 수단',
    total_price        int         default 0                 not null comment '실 결제 금액',
    original_price     int                                   null comment '총 결제 금액 (할인전)',
    reservation_date   datetime                              not null comment '예약 일시',
    cancel_date        datetime                              null comment '취소 일시',
    cancel_reason      varchar(255)                          null comment '취소 사유',
    memo               text                                  null comment '메모',
    result_data        text                                  null comment '응답 결과 값',
    create_date        timestamp   default CURRENT_TIMESTAMP null,
    update_date        timestamp   default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP
)
    comment '예약 마스터';

create index idx_reservation_date
    on reservation_master (reservation_date);

create index idx_reservation_status
    on reservation_master (reservation_status);

create table reservation_tournament
(
    reservation_tournament_idx int auto_increment comment '예약 대회 IDX'
        primary key,
    reservation_idx            varchar(50)                           not null comment '예약번호',
    tournament_idx             int                                   not null comment '대회 IDX',
    member_idx                 int                                   not null comment '회원 정보 IDX',
    form_data                  json                                  not null comment '대회 정보',
    images                     text                                  null comment '이미지 URL ( '','' 로 구분)',
    total_price                int                                   not null comment '총 가격',
    reservation_status         varchar(50) default 'PENDING'         not null comment '결제 상태',
    cancel_reason              varchar(255)                          null comment '부분 취소일 경우 사유',
    create_date                datetime    default CURRENT_TIMESTAMP null,
    update_date                datetime                              null on update CURRENT_TIMESTAMP
)
    comment '예약 대회';

create index reservation_tournament_member_idx_index
    on reservation_tournament (member_idx);

create table review
(
    review_idx      int auto_increment comment '리뷰 IDX'
        primary key,
    review_type     char                                not null comment '리뷰 타입 G: 골프, H: 호텔, C:캐디',
    member_idx      int                                 not null comment '작성한 회원 IDX',
    reservation_idx int                                 not null comment '예약 IDX',
    product_idx     int                                 not null comment '리뷰한 상품 IDX (course_idx, hotel_idx, caddy_idx)',
    review_content  text                                null comment '리뷰 내용',
    review_rate     float                               not null comment '리뷰 별점',
    use_yn          char      default 'Y'               null comment '사용 유무',
    created_at      timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP comment '리뷰 최초 등록 날짜',
    updated_at      timestamp default CURRENT_TIMESTAMP null comment '리뷰 수정한 날짜'
)
    comment '골프, 호텔, 캐디에 대한 유저들의 리뷰';

create index review_product_idx_review_type_index
    on review (product_idx, review_type);

create index review_reservation_idx_review_type_index
    on review (member_idx, review_type);

create index review_reservation_idx_review_type_index_2
    on review (reservation_idx, review_type);

create table review_image
(
    review_image_idx int auto_increment comment '리뷰 이미지 IDX'
        primary key,
    review_idx       int                                 not null comment '리뷰 IDX',
    image_url        varchar(255)                        not null comment '리뷰 이미지',
    use_yn           char      default 'Y'               null comment '사용 유무',
    created_at       timestamp default CURRENT_TIMESTAMP null,
    updated_at       timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP
);

create index review_image_review_idx_index
    on review_image (review_idx);

create table shopping_cart_caddy
(
    shopping_cart_caddy_idx int auto_increment comment '장바구니 캐디 IDX'
        primary key,
    caddy_idx               int                                not null comment '캐디 IDX',
    member_idx              int                                not null comment '회원 정보 IDX',
    reservation_date        date                               not null comment '예약 날짜',
    golf_course_time        int                                not null comment '예약 시간',
    total_price             int                                not null comment '총 가격',
    use_yn                  char     default 'Y'               null comment '사용 Y/N',
    create_date             datetime default CURRENT_TIMESTAMP null,
    update_date             datetime                           null on update CURRENT_TIMESTAMP
)
    comment '장바구니 캐디';

create index shopping_cart_caddy_member_idx_use_yn_index
    on shopping_cart_caddy (member_idx, use_yn);

create table shopping_cart_callvan
(
    shopping_cart_callvan_idx int auto_increment comment '장바구니 콜밴 IDX'
        primary key,
    course_idx                int                                not null comment '골프장 IDX',
    member_idx                int                                not null comment '회원 정보 IDX',
    car_type                  varchar(5)                         not null comment '카 타입(SUV, VAN)',
    start_date                date                               null comment '출발 예약 날짜',
    start_time                varchar(50)                        null comment '출발 예약 시간',
    pickup_location           varchar(255)                       not null comment '출발 지역명',
    dropoff_location          varchar(255)                       not null comment '도착 지역명',
    end_date                  date                               null comment '도착 예약 날짜',
    end_time                  varchar(50)                        null comment '도착 예약 시간',
    round_trip_yn             char                               not null comment '왕복 (Y), 편도(N)',
    number_of_reservation     int                                null comment '예약 탑승 인원',
    number_of_call_van        int                                not null comment '예약 콜밴 대수',
    total_price               int                                not null comment '총 가격',
    use_yn                    char     default 'Y'               null comment '사용 Y/N',
    create_date               datetime default CURRENT_TIMESTAMP null,
    update_date               datetime                           null on update CURRENT_TIMESTAMP
)
    comment '장바구니 콜밴';

create index shopping_cart_call_ven_member_idx_index
    on shopping_cart_callvan (member_idx, course_idx);

create table shopping_cart_golf
(
    shopping_cart_golf_idx   int auto_increment comment '장바구니 골프장 IDX'
        primary key,
    course_idx               int                                not null comment '골프장 IDX',
    member_idx               int                                not null comment '회원 정보 IDX',
    reservation_date         date                               not null comment '예약 날짜',
    golf_course_time         int                                not null comment '예약 시간',
    number_of_reservation    int                                not null comment '예약 인원',
    number_of_call_van       int                                null comment '콜밴 예약 대수',
    car_type                 varchar(5)                         null comment '카 타입(SUV, VAN)',
    round_trip_yn            char                               null comment '왕복 (Y), 편도(N)',
    pickup_location          varchar(255)                       null comment '출발 지역명',
    dropoff_location         varchar(255)                       null comment '도착 지역명',
    golf_monthly_price_idx   int                                not null comment '월별 가격 IDX',
    golf_time_price_idx      int                                null comment '시간별 가격 IDX',
    golf_exception_price_idx int                                null comment '특정 날짜 가격 IDX',
    golf_price_type          varchar(10)                        not null comment '가격 타입 (exception, weekday)',
    golf_course_sale_fee     int                                null comment '그린피',
    cart_sale_fee            int                                null comment '카트 피',
    caddy_sale_fee           int                                null comment '캐디 피',
    callvan_sale_fee         int                                null comment '콜밴 피',
    total_price              int                                null comment '총 가격',
    use_yn                   char     default 'Y'               null comment '사용 Y/N',
    create_date              datetime default CURRENT_TIMESTAMP null,
    update_date              datetime                           null on update CURRENT_TIMESTAMP
)
    comment '장바구니 골프장';

create index shopping_cart_golf_member_idx_use_yn_index
    on shopping_cart_golf (member_idx, use_yn);

create table shopping_cart_hotel
(
    shopping_cart_hotel_idx int auto_increment comment '장바구니 호텔 IDX'
        primary key,
    hotel_idx               int                                not null comment '호텔 IDX',
    member_idx              int                                not null comment '회원 정보 IDX',
    check_in_date           date                               not null comment '체크인 날짜',
    check_out_date          date                               not null comment '체크아웃 날짜',
    hotel_room_idx          int                                not null comment '예약한 호텔 방 IDX',
    number_of_room          int                                not null comment '예약한 객실 수',
    number_of_reservation   int                                null comment '예약 인원',
    adult                   int                                not null comment '성인',
    children                int                                not null comment '아동',
    paid_services           varchar(255)                       null comment '유료 서비스',
    total_price             int                                not null comment '총 가격',
    use_yn                  char     default 'Y'               null comment '사용 Y/N',
    create_date             datetime default CURRENT_TIMESTAMP null,
    update_date             datetime                           null on update CURRENT_TIMESTAMP
)
    comment '장바구니 호텔';

create index shopping_cart_hotel_member_idx_use_yn_index
    on shopping_cart_hotel (member_idx, use_yn);

create table shopping_cart_tournament
(
    shopping_cart_tournament_idx int auto_increment comment '장바구니 대회 IDX'
        primary key,
    tournament_idx               int                                not null comment '대회 IDX',
    member_idx                   int                                not null comment '회원 정보 IDX',
    form_data                    json                               not null comment '대회 정보',
    images                       text                               null comment '이미지 URL ( '','' 로 구분)',
    use_yn                       char     default 'Y'               null comment '사용 Y/N',
    create_date                  datetime default CURRENT_TIMESTAMP null,
    update_date                  datetime                           null on update CURRENT_TIMESTAMP
)
    comment '예약 대회';

create index shopping_cart_tournament_member_idx_use_yn_index
    on shopping_cart_tournament (member_idx, use_yn);

create table terms
(
    use_terms             text                               not null comment '이용약관',
    private_info_terms    text                               not null comment '개인정보 수집 및 이용 동의 약관',
    payment_service_terms text                               not null comment '결제 대행 서비스 약관 동의',
    created_at            datetime default CURRENT_TIMESTAMP not null,
    updated_at            datetime                           null on update CURRENT_TIMESTAMP
)
    comment '이용약관';

create table tournament
(
    tournament_idx     int auto_increment comment '대회 IDX'
        primary key,
    title              varchar(255)                        not null comment '타이틀',
    title_en           varchar(255)                        not null comment '타이틀 영문',
    price              int                                 not null comment '판매가',
    start_date         date                                null comment '대회 시작 날짜',
    end_date           date                                null comment '대회 종료 날짜',
    tournament_status  char      default 'Y'               null comment '대회 노출 Y/N',
    image_use_yn       char      default 'N'               not null comment '이미지 업로드 사용 Y/N',
    image_title        varchar(255)                        null comment '이미지 업로드 타이틀',
    content            text                                not null comment '컨텐츠',
    created_at         timestamp default CURRENT_TIMESTAMP null,
    created_member_idx int                                 not null comment '생성자 IDX',
    updated_at         timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    updated_member_idx int                                 null comment '수정자 IDX'
)
    comment '대회 테이블';

create index tournament_start_date_end_date_tournament_status_index
    on tournament (start_date, end_date, tournament_status);

create table tournament_image
(
    tournament_image_idx int auto_increment comment '대회 이미지 IDX'
        primary key,
    tournament_idx       int                                  not null comment '대회 IDX',
    image_url            varchar(255)                         null comment '이미지 URL',
    sort                 int                                  null comment '정렬순서',
    main_yn              varchar(1) default 'N'               null comment '메인이미지여부',
    use_yn               varchar(1) default 'Y'               null comment '사용여부',
    created_at           timestamp  default CURRENT_TIMESTAMP null,
    created_member_idx   int                                  not null,
    updated_at           timestamp  default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    updated_member_idx   int                                  null
)
    comment '대회 이미지';

create index tournament_image_tournament_idx_use_yn_index
    on tournament_image (tournament_idx, use_yn);

create table wish
(
    wish_idx    int auto_increment comment '찜 idx'
        primary key,
    wish_type   char                                not null comment '찜 상품 타입 G: 골프, H: 호텔, C: 캐디, S: 쇼핑',
    member_idx  int                                 not null comment '찜한 회워 IDX',
    product_idx int                                 not null comment '찜한 상품 idx',
    use_yn      char      default 'Y'               null,
    created_at  timestamp default CURRENT_TIMESTAMP null,
    updated_at  timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP
)
    comment '유저가 찜한 상품 테이블';

create index wish_member_idx_wish_type_use_yn_index
    on wish (member_idx, wish_type, use_yn);

