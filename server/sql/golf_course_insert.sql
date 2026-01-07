INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Alpine Golf & Sport Club', '알파인 골프 앤 스포츠 클럽', 'TH', 'BKK', 18, '99 M.9 Bangkhan-Sathaneevithayu Road, Klong 5, Klong Luang, Pathumthani 12120 Thailand', '6625773333', 'https://www.alpinegolfclub.com/', 4, 'N', NULL, 'Ronald M. Garl', 'L', 3, 'N', '버뮤다그래스', '버뮤다그래스', 60, 'https://maps.app.goo.gl/ojXphjiAdENRDRhC9', '알파인 골프 & 스포츠 클럽은 태국 최고 등급 코스 중 하나이자 세계적으로도 이름난 명문 골프장입니다. 미국 최고의 골프 코스 건축가 중 한 명인 Ronald Garl이 만든 레이아웃은 Tiger Woods가 우승한 2000년 Johnnie Walker Classic PGA 토너먼트의 장소였으며 2004년에도 같은 이벤트를 주최했습니다.
뛰어난 홀 라우팅 뿐만 아니라, 이 회원제 골프 클럽 유지 관리는 최고 수준이며 유리알 그린과, 기복이 심한 페어웨이가 특징입니다.
난이도 높은 골프장을 원하시는 골퍼들에게 강력 추천합니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', 'N', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Ayutthaya Golf Club', '아유타야 골프 클럽', 'TH', 'BKK', 18, '356 Phra Nakhon Si, Ayutthaya 13000, Thailand', '6635703664', 'http://www.aygolfclub.com/2011/index.php', 6, 'W', NULL, 'Attanan Yomchinda', 'N', 1, 'N', NULL, NULL, 70, 'https://maps.app.goo.gl/ewW1X7aWWgPptjeq8', '태국에서 유서 깊은 아유타야에 위치한 파 72, 18홀 챔피언십 코스로, 방콕 중심에서 차로 약 1시간 반 거리에 자리해 있습니다. 넓은 페어웨이와 큰 그린을 가진 파크랜드 스타일로, 초보자도 즐길 수 있을 만큼 플레이가 수월하지만 곳곳에 자리한 워터 해저드와 굴곡 있는 그린이 전략적 도전을 더합니다. 13번 홀은 좁은 파 4 홀이며, 철도 옆을 지나가는 골프코스로 특히 주의가 요구되는 시그니처 홀 중 하나입니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '갤러리피 없음', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Bangsai country_code Club', '방사이 컨트리 클럽', 'TH', 'BKK', 27, '77/7 Moo 3, Samkok-Sena Road, Bangphli, Bang Sai, Ayutthaya 13190, Thailand', '66816439121', 'https://www.facebook.com/Bangsaicountry_codeClub/?locale=th_TH', 5, 'Y', NULL, 'Golf East (Pirapon Namatra)', 'N', 1, 'N', NULL, NULL, 80, 'https://maps.app.goo.gl/x8XjSAkvHtQcCvug8', '"Pirapon Namatra가 설계한 오픈 컨트리 스타일이 특징이며, 개별 홀이 모두 독특한 레이아웃으로 구성되어 있어 전략적인 샷이 요구됩니다.
특히 구릉 페어웨이, 측면 해저드가 있는 11번 홀, 거대한 모래언덕이 아웃라인을 이루는 3~5번 홀이 인상적이며, 변화무쌍한 코스 구성으로 흥미로운 플레이를 선사합니다.합리적인 그린피와 평일 한적한 분위기로 초보자부터 숙련된 골퍼까지 모두 만족할 만한 코스로 자리매김하고 있습니다."');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '950/1050 (캐디피+카트피 포함)', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Bangkok Golf Club', '방콕 골프 클럽', 'TH', 'BKK', 18, '99 Moo 2, Tiwanon Road, Bangkadi Subdistrict, Muang District, Pathum Thani 12000, Thailand', '6625012828', 'https://www.mbkgolf.com/bangkok-golf/', 5, 'N', NULL, 'Chird Boonyarattanevet', 'H', 2, 'Y', '조이시아', '버뮤다 티프 이글', 60, 'https://maps.app.goo.gl/uHsRq5rkmMV4ZVBD7', '1993년 개장한 18홀 파 72 챔피언십 코스로, “속도감 있는 그린”을 자랑하는 Tif‑Eagle 잔디 그린과 Zoysia 페어웨이로 연중 균일한 경기 품질을 제공합니다. 6,700야드 전후의 비교적 짧은 거리에도 불구하고, 곳곳에 자리한 워터 해저드와 나무, 12개의 큰 호수가 전략적인 플레이를 요구하며 묘미를 더합니다. 특히 좁은 페어웨이와 빠른 그린이 조화를 이루어 정확한 샷이 더욱 중요시되며, 2003년 아시안 투어의 Volvo Masters를 개최한 명문 코스이기도 합니다');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '500', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Bangpoo Golf And Sport', '방푸 골프 앤 스포츠', 'TH', 'BKK', 18, '191 Moo 3, Phraek Sa Mai, Samut Prakan 10280, Thailand', '6620952899', 'http://www.bangpoogolf.com/', 5, 'Y', NULL, 'Arnold Palmer', 'N', 2, 'N', NULL, NULL, 40, 'https://maps.app.goo.gl/241rNSMegVB4fCGH8', '1991년에 전설적인 골프 설계가 **아놀드 파머(Arnold Palmer)**에 의해 설계된 태국 내 유일한 코스로, 총 18홀 파 72의 챔피언십 레이아웃을 자랑합니다. 코스는 넓은 페어웨이와 큰 그린, 구릉 지형 그리고 다채로운 자연 꽃들이 어우러진 아름다운 파크랜드 스타일로 조성되어 있으며, 가까운 해안의 시원한 바닷바람이 여름철에도 쾌적한 라운딩을 가능하게 합니다. 수많은 수변 장애물은 없지만, 세찬 바닷바람이 오후에는 전략적인 도전을 제공하며, 초급자에게도 친숙하면서도 적절한 난이도를 유지합니다');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '700', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Best Ocean Golf Club', '베스트 오션 골프 클럽', 'TH', 'BKK', 18, '4/5 Moo 7, Rama 2, Khok Kham, Muang, Samut Sakhon 74000, Thailand', '6634451144', 'https://www.facebook.com/bestoceangolfthailand/', 6, 'Y', NULL, 'Lee Schmidt and Brian Curley', 'N', 1, 'N', NULL, NULL, 60, 'https://maps.app.goo.gl/ukTUB3ygGHYrsSFx9', '링크스 스타일의 18홀, 파 72 챔피언십 코스로, Lee Schmidt와 Brian Curley가 설계한 도전적인 코스입니다. 해안 가까이 자리해 시원한 해풍이 라운딩을 돕는 반면, 그 바람이 샷의 방향을 쉽게 흐트러뜨려 코스를 더욱 까다롭게 만듭니다. 좁은 페어웨이와 모든 홀에 워터 해저드, 그리고 고저 차가 있는 그린은 정확한 티샷과 신중한 전략적 플레이를 요구합니다');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '500', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Cascata Golf Club', '카스카타 골프 클럽', 'TH', 'BKK', 36, '87 Moo 2, Lumlukka Klong 15 Road, Tambon Chumpol, Amphoe Ongkharak, Nakhon Nayok 26120, Thailand', '66874933888', 'https://cascata.co.th/', 5, 'Y', NULL, 'Thanawat Saprungruang', 'N', 2, 'N', NULL, NULL, 60, 'https://maps.app.goo.gl/ChkwLpqNxnruA5fG9', '관대한 페어웨이, 최고의 그린!
카스카타 골프 클럽은 태국의 수많은 골프장 중에서 상대적으로 새로 등장한 36홀 골프 코스입니다. 코스는 늘 최상의 상태를 유지하고 있으며,
A 및 B 코스는 평이하지만, 많은 개방형 페어웨이가 통합되어 스코틀랜드 링크 스타일의 경험을 선사하고, C 코스와 D 코스는 Cascata의 4개 코스 중 더 도전적입니다. 이 조합은 7,400야드가 넘는 전장과 기복이 심한 지형, 대부분의 그린이 높고 단순한 투 퍼팅도 어려울 정도로 최상의 난이도를 제공합니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '1200/1800', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Dynasty Golf & country_code Club', '다이너스티 골프 앤 컨트리 클럽', 'TH', 'BKK', 18, '99 Moo 3, Poldamri Road, Bang Len District, Nakhon Pathom 70130, Thailand', '6634993333', 'https://dynastygolfclub.com/', 5, 'Y', NULL, 'Dennis Griffiths', 'N', 2, 'N', NULL, NULL, 90, 'https://maps.app.goo.gl/mhL77hSmfQBAx744A', '1993년 덴리스 그리피스(Denis Griffiths)가 설계한 18홀, 파 72 챔피언십 코스로, 방콕 시내에서 차로 약 90분 거리의 전형적인 라이스패디(논) 스타일 골프장입니다. 넓은 페어웨이와 대형 그린, 그리고 거의 모든 홀에 배치된 워터 해저드는 전략적인 샷을 요구하며, 지형이 평탄한 만큼 정교함이 관건이 됩니다. Tifway 버뮤다 잔디가 페어웨이와 그린 모두에 사용되어 일관된 그린 상태와 쾌적한 플레이 환경을 제공합니다');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '1250바트(갤러리피+카트피+캐디피)', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Flora Ville Golf & country_code Club', '플로라빌 골프 & 컨트리 클럽', 'TH', 'BKK', 18, '110 Moo 8, Bangkok-Pathum Thani Road, Bang Ku Wat, Mueng Pathum Thani, Pathum Thani 12000, Thailand', '6625982839', 'https://www.floragolfcourse.com/', 5, 'N', NULL, 'Nick Faldo', 'N', 2, 'N', '파스팔럼', '티프드워프 버뮤다', 60, 'https://maps.app.goo.gl/iuAKmezjr4g69NFB8', '1998년 개장한 Flora Ville 골프 코스는 방콕에서 Nick Faldo가 디자인한 몇 안 되는 코스 중 하나입니다. 잘 관리된 페어웨이는 일반적으로 큰 나무나 측면 워터해저드로 둘러싸여 있고, 많은 홀이 도그레그로 진행되기 때문에 정확한 티샷은 좋은 스코어를 얻기 위한 필수 조건입니다. 플로라 빌의 가장 큰 어려움은 그린입니다. 크기가 작고 표면이 단단하기 때문에 온그린이 쉽지 않아 업다운과 파세이브를 위해서는 자신감 있는 숏게임이 필요합니다. Flora Ville 골프 코스는 골프의 즐거움을 만끽할 수 있는 태국에서 가장 가치 있는 코스 중 하나입니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '1000', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Green Valley country_code Club', '그린밸리 컨트리 클럽', 'TH', 'BKK', 18, '99 Moo 7, Bangna-Trad Road, Km. 18, Bangkaew Subdistrict, Bangplee District, Samut Prakan 10540, Thailand', '6623125883', 'https://www.greenvalleybangkok.com/', 5, 'N', NULL, 'Robert Trent Jones Jr.', 'H', 2, 'Y', NULL, NULL, 20, 'https://maps.app.goo.gl/z2RWP5aBEymt3kiz8', '"그린밸리는 비교적 평탄한 지형에 펼쳐져 있어 걷기에 좋습니다. 그린은 크고 빠르며 기복이 심하고 핀이 까다로운 지점에 자리잡고 있습니다. 물이 대부분의 페어웨이 측면에 있기 때문에 정확한 드라이브는 좋은 점수를 얻는 데 필수입니다. 그린 밸리에는 골프의 난이도를 더욱 높이는 잘 배치된 해저드가 많이 있어 코스 공략에 더욱 주의를 기울이게 합니다.
그린 밸리는 현지인과 외국인들에게 인기가 많습니다. 조화로운 플레이 환경에서 도전을 원하는 방콕 골퍼라면 그린밸리 컨트리클럽에 도전해 보는 것을 추천합니다."');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '500바트 / 캐디 450, 카트 850, 팁 500 (동승 불가)', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Krung Kavee Golf & country_code Club', '크룽카비 골프 코스 앤 컨트리 클럽', 'TH', 'BKK', 18, '99 Moo 3, Krung Kavee Road, Bangkadi Subdistrict, Muang District, Pathum Thani 12000, Thailand', '66257741419', 'https://krungkavee.com/', 5, 'N', NULL, 'Manabu Sakamoto', 'H', 2, 'N', NULL, NULL, 35, 'https://maps.app.goo.gl/rnHBggCgkRj4WkdV8', '18홀 파 72(7,082야드) 규모의 챔피언십 코스로, 일본의 저명한 디자이너 Manabu Sakamoto가 설계했으며 완성도 높은 코스 디자인으로 정평이 나 있습니다. 넓은 평지 위 구획된 전형적인 파크랜드 스타일에 자연 및 인공 호수와 수로가 조화된 전략적인 수계 시설이 돋보이며, 섬 그린 등의 독특한 구성이 도전적인 플레이를 요구합니다. 코스는 침수 걱정 없는 첨단 배수 시스템을 갖추고 있어 방콕의 우기 시즌에도 안정적인 라운딩이 가능합니다');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '1,500바트(카트 동승 시)', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Lakewood country_code Club', '레이크우드 컨트리 클럽', 'TH', 'BKK', 18, '99/1 Moo 11, Bangna-Trad Highway (KM. 18), Bang Chalong, Bang Phli District, Samut Prakan Province, Thailand 10540', '6623126278', 'https://www.lakewoodcountry_codeclub.co.th/en/index.php', 5, 'W', NULL, 'J. Michael Poellet', 'N', 1, 'N', '버뮤다', '티프드워프 버뮤다', 30, 'https://maps.app.goo.gl/miVqaxNuW6cTXAjL7', '태국 여자 오픈 골프 챔피언십(Thailand Ladies Open Golf Championship)의 본거지인 레이크우드 컨트리 클럽(Lakewood country_code Club)은 Michael J. Poellet(미국)이 설계한 세계 최고 수준의 27홀(레이크, 우드, 록, 각 9홀) 골프 코스입니다. 버뮤다 잔디의 페어웨이는 일년 내내 잘 관리되어 있으며 배수가 우수하여 어떤 계절에도 상태가 좋습니다.
도전적이면서도 균형 잡힌 위험과 보상이 혼합된 Lakewood는 골퍼들에게 독특하고 기억에 남는 경험을 제공할 것입니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '그린피의 100% / 의무 카트피 500바트', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Lakewood Link (Open Fri,Sat,Sun)', '레이크우드 링크스 골프 코스', 'TH', 'BKK', 18, '99/1 Moo 11, Bangna-Trad Highway (KM. 18), Bang Chalong, Bang Phli District, Samut Prakan Province, Thailand 10540', '6623126275', 'https://www.lakewoodlinksthailand.com/en/index.php', 5, 'Y', NULL, 'Local Thai Design', 'N', 2, 'N', '버뮤다', '티프드워프 버뮤다', 30, 'https://maps.app.goo.gl/XmWAMWo1uaFN64zZ7', '도심에서 차로 단 30분 거리에 있는 챔피언십 스타일의 18홀, 파 72 코스로, 전체 길이는 약 7,100야드에 달합니다
. 이 코스는 평탄한 링크 스타일의 지형 위에 펼쳐져 있으며, 사구, 물이 함께 어우러져 전략적인 샷과 도전을 요구하는 독특한 분위기를 제공합니다. 특히 파‑3 8번 홀이 ‘게(crab)’ 모양의 섬 그린, 그리고 16번 홀은 ‘불가사리(starfish)’ 모양의 섬 그린을 갖추고 있는 시그니처 홀이며, 두 홀이 동일한 티잉 그라운드를 사용하는 독창적인 구성으로 유명합니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '그린피의 100%+의무카트피 500바트추가', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Lam Lukka country_code Club', '람 룩카 컨트리 클럽', 'TH', 'BKK', 36, '29 Moo 7, Tambon Lamsai, Lam Luk Ka, Klong 11, Pathum Thani 12150, Thailand', '66816157292', 'https://www.lamlukkacc.com/contact.html', 5, 'W', NULL, 'Roger Packard', 'N', 1, 'N', '티프웨이 419', '티프이글', 60, 'https://maps.app.goo.gl/kuwxR2NDEDjq7r5d9', '36홀 챔피언십 규격의 람 룩카는 쉽게 잊혀지지 않는 골프 경험을 제공합니다. 코스 내 10,000그루가 넘는 나무와 다채로운 수로, 방콕의 타 골프장보다 그늘이 많고 바람이 많이 부는 조건을 갖춘 탄탄한 파크랜드 레이아웃은 더운 날씨가 힘든 골퍼들에게 늘 환영을 받습니다. 코스 레이아웃뿐만 아니라 잘 관리된 그린은 Lam Luk Ka 컨트리 클럽의 수준 높은 골프 환경을 더욱 빚나게 해줍니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '750', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('The Legacy Golf Club', '레거시 골프 클럽', 'TH', 'BKK', 18, '10 Moo 7, Liabklongsong, Klong Samwatawantok, Klong Samwa, Bangkok 10510, Thailand', '6629141930', 'https://www.facebook.com/legacygolfclubs/?locale=th_TH', 5, 'W', NULL, 'Jack Nicklaus', 'H', 2, 'N', '버뮤다', '티프이글 버뮤다', 45, 'https://maps.app.goo.gl/zLqNPygHpXeYYSiw9', '잭 니클라우스가 설계한 18홀 파 72 챔피언십 코스로 넓은 페어웨이와 거대한 웨이스트 벙커, 그리고 절반 이상의 홀에 배치된 워터 해저드가 조화를 이루어 전략적이면서도 도전적인 플레이를 제공합니다. 각 홀은 난이도와 개성이 뚜렷해 반복 라운딩 시에도 매번 새로운 도전을 느낄 수 있으며, 5개의 티 박스를 제공해 초급자부터 장타를 즐기는 상급자까지 모두 만족할 수 있습니다. 특히 파 4의 16번 홀은 물 위에 떠 있는 듯한 섬 그린으로 유명하며, 바람과 거리 감각을 동시에 고려해야 하는 시그니처 홀로 꼽힙니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Muang Kaew Golf Club', '무앙 깨우 골프 코스', 'TH', 'BKK', 18, '52 Moo 8, Bangna-Trad Highway, Km 7.7, Bangkaew, Bang Phli District, Samut Prakan 10540, Thailand', '6627402699', 'https://muangkaewgolf.com/', 5, 'Y', NULL, 'Lee Schmidt and Brian Curley', 'L', 2, 'N', '조이시아', '티프드워프 버뮤다', 25, 'https://maps.app.goo.gl/HBhKhszYK1C65tJR9', '무앙깨우(Muang Kaew)는 18홀 챔피언십 규격의 골프 코스입니다. 도전적인 홀이 많으며, 모두 호수와 골프 코스를 통과하는 수로가 있는 공원 환경에 설정되어 있습니다. 홀에는 다양한 나무가 늘어서 있어 골프 코스에 멋진 분위기와 도전적인 플레이를 선사합니다. 페어웨이가 보이지 않고 볼을 도그렉으로 쳐야 하기 때문에 티오프부터 짜릿한 시그니처 홀인 13번홀 (파5, 570야드)에 도전해보세요.
 방콕 시내에서 단 20분, 수완나품 공항에서 20분 거리의 접근성 또한 방콕을 찾는 수많은 골퍼들에게 인기 높은 이유 중의 하나입니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '1700/2200', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Navatanee Golf Course', '나바타니 골프 코스', 'TH', 'BKK', 18, '22 Navatanee Road, Kwaeng Ramintra, Khet Khan Na Yao, Bangkok 10230, Thailand', '6623761818', 'http://www.navatanee.com/', 4, 'Y', NULL, 'Robert Trent Jones Jr.', 'L', 2, 'N', '버뮤다', '티프드워프 버뮤다', 20, 'https://maps.app.goo.gl/5iiprfgbqPms9Gdu6', '1973년 로버트 트렌트 존스 주니어(Robert Trent Jones Jr.)가 설계한 18홀 파 72의 클래식 파크랜드 스타일 챔피언십 코스로, 1975년 제23회 월드컵 골프 대회를 개최하며 태국 골프의 역사적 출발점이 되었습니다. 풍성한 수령의 나무와 붉은꽃, 부겐빌레아가 어우러진 페어웨이와 그린은 도시의 소음과 스트레스로부터 벗어나게 해주는 평화로운 분위기를 제공합니다. 시그니처 홀이자 난도가 높은 6번 홀은 445야드 파 4로, 티샷에서 장타와 정확성이 모두 요구되며 워터 해저드가 왼쪽을 따라 길게 이어져 플레이어에게 실력 이상의 도전을 안깁니다. 나바타니는 골프의 역사적 의미와 전략적 난이도가 조화된, 도심 한복판에서 만나볼 수 있는 진정한 클래식 명문 코스입니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', 'N', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Northern Rangsit Golf Club', '노던 랑싯 골프 클럽', 'TH', 'BKK', 18, '19/2 Moo 7, Phaholyothin Road (KM 58), Tambon Wangnoi, Amphur Wangnoi, Phra Nakhon Si Ayutthaya 13170, Thailand', '66819940951', 'http://www.northernrangsit.com/', 5, 'N', NULL, 'Local Thai Designer', 'N', 1, 'N', NULL, NULL, 70, 'https://maps.app.goo.gl/t69Xb2zvG9BShdkT8', '1993년에 설립된 18홀, 파 72 챔피언십 코스로 평탄한 파크랜드 스타일로 설계되었으며, 운하와 논, 다양한 워터 해저드가 어우러져 직사각형 형태의 레이아웃을 이루고 있어 전략적 변수를 고루 갖추고 있습니다. 대부분의 홀에서 워터 해저드가 플레이에 깊숙이 개입하며, 특히 티샷이 정확하지 않으면 물이나 해저드에 빠질 수 있어 정밀 샷이 요구됩니다. 코스의 하이라이트인 18번 홀은 섬처럼 둘러싸인 그린과 아름답고 까다로운 난이도가 조화를 이루는 시그니처 홀로, 마지막까지 집중이 필요한 공략을 요구합니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '200(카트 쉐어) / 카트 추가 시 600바트', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Nikanti Golf Club', '니칸티 골프클럽', 'TH', 'BKK', 18, '333 Moo 2, Thammasala, Mueang Nakhon Pathom District, Nakhon Pathom 73000, Thailand', '6634965666', 'https://www.nikantigolfclub.com/', 4, 'Y', NULL, 'Pirapon Namatra, Golf East', 'L', 3, 'N', '파스팔럼', '티프드워프 버뮤다', 90, 'https://maps.app.goo.gl/dGmks9rUyMWAUuC5A', '세계 유일의 6홀(파5), 6홀(파4), 6홀(파3)의 코스 설계로 유명한 태국의 명문 골프장
정교하게 관리된 페어웨이와 빠르고 굴곡진 그린은 니칸티의 대표적인 특징 중 하나이며, 다양한 지형 요소는 숙련된 골퍼들에게도 도전 과제를 제시한다. 최상의 골프코스 뿐만 아니라, 부페 2식/물/수건/우산제공 등의 타 골프장 대비 압도적인 서비스로 한국 골프들에게 정말 사랑을 받는 골프장입니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '성인 라운딩 요금과 동일, 아동 갤러리피 주중: 2,900바트 / 주말: 4,500바트, 여권 제시 필수 (카드피, 캐디피, 라운딩 전/후 2회 식사와 간식, 라커룸 포함)', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Panya Indra Golf Club (Close Mon)', '판야 인드라 골프 클럽', 'TH', 'BKK', 27, '9 Panyaramindra Road (Km. 9) Khannayao, Bangkok, 10230, Thailand', '6629430000', 'https://www.panyagolf.com/th/', 6, 'Y', NULL, 'Ronald Fream & David Dale', 'H', 3, 'Y', '파스팔럼', '티프드워프 버뮤다', 25, 'https://maps.app.goo.gl/gdWttTtUKh3AQNM38', '미국의 Ronald Fream과 David Dale이 설계한 Panya Indra 골프 클럽은 각각 독특한 디자인과 독특한 환경을 갖춘 3개의 9홀 챔피언십 코스로 구성되어 있습니다. 골프 코스는 외곽 순환 도로 바로 옆에 있어 방콕 대부분의 호텔에서 30분-40분 안에 도달할 수 있습니다.
Panya Indra의 기복이 있는 페어웨이와 거의 모든 홀에는 호수와 연못이 있습니다. 파3 홀은 사실상 모두 물 위에서 플레이하기 때문에 아마도 이 코스에서 가장 어려운 부분일 것입니다. 팜(B) 코스와 가든(C) 코스는 야간 골프를 즐기기에 좋은 조명을 갖추고 있습니다. 추가 비용으로 이용 가능한 Pretty Caddy는 Panya Indra만의 독특한 매력입니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '1000', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Phoenix Gold Bangkok', '피닉스 골드 방콕', 'TH', 'BKK', 18, '54 Moo 5, Soi Suwinthawong 96, Lum Toiting Subdistrict, Nong Chok District, Bangkok 10530, Thailand', '66848735363', 'https://www.phoenixgoldgolf.com/', 5, 'Y', NULL, 'Robert Trent Jones Jr.', 'H', 3, 'N', NULL, NULL, 30, 'https://maps.app.goo.gl/b7iMueck9n5Bao7RA', '아름다운 자연 경관과 전략적인 코스 디자인으로 잘 알려진 프리미엄 골프장
챔피언십 수준의 코스를 보유하고 있어 KLPGA 윈터투어, KLPGA, 아시안투어 등 국제 대회의 개최지로도 유명합니다. 
다양한 난이도의 홀 구성은 골퍼들에게 도전과 재미를 동시에 제공하며, 현대적인 시설과 고급 클럽하우스는 라운딩의 만족도를 높여주며, 방콕 도심과의 접근성도 우수하여 국내외 골퍼들에게 인기가 높습니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '500', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Pinehurst Golf & country_code Club', '파인 허스트 골프 앤 컨트리 클럽', 'TH', 'BKK', 18, '146/4 Moo 17, Phaholyothin Road, Khlong Nueng, Amphur Khlong Luang, Pathum Thani 12120, Thailand', '6625168679', 'https://www.pinehurst.co.th/', 5, 'Y', NULL, 'Yoshihara Aihara', 'H', 2, 'Y', '조이시아', '티프드워프 버뮤다', 55, 'https://maps.app.goo.gl/Bbbbm5F74nmBKr8f8', '요시하라 아이하라(Yoshihara Aihara)가 설계한 27홀(3개의 9홀 루프 구성), 파 72 챔피언십 파크랜드 스타일 골프 클럽으로 1992년 Johnnie Walker Classic과 1994년 Thailand Open을 개최한 역사적인 코스입니다. 각 9홀은 서구 스타일의 북쪽 ‘레이크’, 부드럽고 평탄한 남쪽 ‘그린필드’, 전략적 도전을 주는 서쪽 ‘포레스트’ 코스로 특징이 다채로워 플레이어에 색다른 재미를 제공합니다. 전 코스에 걸쳐 다양한 워터 해저드와 벙커 배치가 있어 단순히 힘만으로는 공략하기 어려운 설계입니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '주중 : 오전 1,100바트, 오후 850바트 2) 주말 : 오전 1,450바트, 11시 이후 1,000바트 / 카트 동승가능, 카트이용시 700바트추가', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Royal Bang Pa-in Golf Club', '로얄 방파인 골프 클럽', 'TH', 'BKK', 18, '19 Moo 14, Bang Krasan, Bang Pa-in District, Phra Nakhon Si Ayutthaya 13160, Thailand', '66631952286', 'https://royalbpgolf.com/', 5, 'Y', NULL, 'Schmidt-Curley', 'L', 2, 'N', '파스팔럼', '챔피언 울트라 드워프 버뮤다 잔디', 60, 'https://maps.app.goo.gl/JdiXGWMhaoXbP2hU7', '로얄 방파인 골프 클럽은 세계 최고의 골프 코스 설계자 중 한 명인 Schmidt-Curley Inc.가 설계한 18홀 챔피언십 규격의 5성급 골프 클럽입니다. 페어웨이는 대부분 매우 단단하여 낮은 샷과 드로우 샷에서 런이 많이 발생하고, 러프는 두껍고 끈적하기 때문에 좋은 스코어를 위해서는 페어웨이를 유지하는 것이 정말 중요합니다. 그린은 빠른 속도와 심한 기복으로 매우 흥미로운 퍼팅 경험을 제공해 줄 것입니다. 안목있는 골퍼들을 확실히 만족시킬 수 있는 방콕 골프 코스, 로얄 방파인 골프 클럽');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '1,550바트(캐디,카트 포함 / 캐디팁 불포함)', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Rachakram Golf Club', '라차캄 골프 클럽', 'TH', 'BKK', 18, '84 Moo 1, Changyai (Chang Yai), Bang Sai (Bangsai), Phra Nakhon Si Ayutthaya 13290, Thailand', '6635367060', 'https://www.rachakramgolfclub.com/', 6, 'Y', NULL, 'Dr. Sukitt Klangvisai', 'N', 2, 'Y', '조이시아', '티프드워프 버뮤다 잔디', 60, 'https://maps.app.goo.gl/av5CjpKMzFk2NWjZ9', '2006년 개장한 18홀, 파 72 (약 6,941야드) 챔피언십 코스로, Dr. Sukitt Klangvisai가 설계해 다양한 디자인과 길이의 홀을 경험할 수 있습니다. 페어웨이는 넓고 평탄하며 약간의 요철을 포함해 링크스 스타일의 플레이를 가능하게 해주며, 나무가 점차 성장하면서 플레이 난이도도 더해지고 있습니다. 그린은 단단하고 빠른 속도를 자랑하면서도 어프로치샷을 잘 받을 수 있어 전략적인 플레이를 요구하며, 벙커의 거친 질감은 스핀 샷 공략에도 유리합니다. 방콕 최고의 가성비 골프장 중의 하나로 한국 골퍼들에게 사랑을 받는 골프 클럽입니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '400', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Riverdale Golf Club', '리버데일 골프 클럽', 'TH', 'BKK', 18, '123/5 Moo 1, Tiwanon Road, Bang Kadi, Mueang Pathum Thani, Pathum Thani 12000, Thailand', '6625012789', 'https://www.mbkgolf.com/', 5, 'N', NULL, 'Jonathan Morrow & Al Tikkanen', 'H', 3, 'N', '파스팔럼', '미니베르데 울트라드워프 버뮤다', 60, 'https://maps.app.goo.gl/1NPXNDsYGw1PDs2F6', '리버데일 골프 클럽은 푸켓의 유명 골프코스 Red Mountain을 설계한 Jonathan Morrow와 Al Tikkanen의 숨은 역작입니다. 리버데일은 언뜻 보기에 도전적인 골프 코스로 보이지 않을 수도 있지만, 그것은 착각입니다.
완만하게 구불구불한 페어웨이, 갈대가 늘어선 작은 호수, 융기된 그린, 훌륭한 벙커링, 큰 언덕의 아름다운 상호 작용을 통한 홀라우팅은 리버데일 골프클럽의 진정한 즐거움입니다. 또한 빼어난 전망과 우아한 시설의 5성급 개인 회원 골프 클럽 수준의 클럽하우스도 빼놓을 수 없는 즐거움의 하나일 것입니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '800', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Royal Lakeside Golf Club', '로얄 레이크 사이드 골프 클럽', 'TH', 'BKK', 18, '150 Moo 3, Bangna-Trad Road, Thakham, Nong Chok / Bang Pakong, Chachoengsao 24130, Thailand', '6638573275', 'https://royallakeside.com/', 6, 'N', NULL, 'Sumitomo Construction', 'N', 2, 'N', '조이시아', '울트라 드워프 버뮤다 잔디', 45, 'https://maps.app.goo.gl/J3jEdcxeNNVsb9APA', '1993년에 개장한 18홀 파 72 챔피언십 코스로 아름다운 수변 경관과 열대 식물로 둘러싸인 평화로운 환경을 자랑합니다. 초미립 버뮤다(TifEagle) 그린은 빠르고 정교한 퍼팅 감을 제공하며, 조이시아 잔디의 페어웨이, 그리고 전략적인 워터 해저드와 벙커, 다양한 지형이 플레이에 깊이를 더합니다. 코스는 방파콩 강과 연못 주변에 배치된 홀들로 구성되어 있으며, 시원한 강바람이 코스 전반을 감싸면서 시각적 쾌적함과 플레이의 재미를 동시에 선사합니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '1,450바트(캐디+카트포함) / 캐디, 카트 의무 사용', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Summit Windmill Golf Club', '섬밋 윈드밀 골프 클럽', 'TH', 'BKK', 18, '72 Moo 14, Bangna-Trad Road (Km 10.5), Bangplee, Samut Prakan 10540, Thailand', '6627502112', 'http://www.summitwindmillgolfclub.com/', 5, 'Y', NULL, 'Nick Faldo', 'L', 2, 'Y', '버뮤다', '티프드워프 버뮤다', 20, 'https://maps.app.goo.gl/3GuKtoWVRJoLMAbo7', '서밋 윈드밀 골프 클럽은 국제 표준을 충족하는 태국 최고의 골프 ​​코스 중 하나로 대부분의 도시 골프 코스와는 달리 도전적이고 즐거운 플레이 경험을 제공합니다. 인공 호수와 조경된 정원이 코스 전체에 아름다움과 어려움을 더해줍니다. 시그니처 홀 중 하나는 파 4 16번홀로, 티오프부터 퍼팅 그린까지 호수를 따라 굴곡진 백사장이 펼쳐져 있습니다. 
자연에 둘러싸여 시간의 제약 없이 낮과 밤 모두 플레이가 가능한 최고의 골프장이 여러분을 기다립니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '갤러리 이용 시 카트+캐디 의무 사용. 주중 3,200바트 주말3,700바트 / 트와일라잇2,450바트 / 나이트 2,250바트', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Siam country_code Club Bangkok (close Mon)', '시암 컨트리 클럽 방콕', 'TH', 'BKK', 18, '111 Bangna-Trad Road (Km 22), Sisa Chorakhe Yai, Bang Sao Thong District, Samut Prakan 10570, Thailand', '6620783888', 'https://siamcountry_codeclub.com/', 5, 'N', NULL, 'Toby Cobb', 'L', 2, 'N', '조이시아', '울트라 드워프 버뮤다', 30, 'https://maps.app.goo.gl/XxSRj8Xd4H2CSJbg7', '2022년에 오픈한 명문 시암 컨트리 클럽의 다섯 번째 코스로, **토비 콥(Toby Cobb)**이 설계한 파 72, 18홀 챔피언십 코스입니다. 코스는 버뮤다 초미립(울트라-더워프) 잔디의 그린과 조이시아 페어웨이로 구성되어 있어 연중 일정한 플레이 품질을 자랑하며, 부드러운 롤링 페어웨이와 항아리 벙커로 특유의 재미와 전략성을 더합니다. 워터 해저드는 전체 18홀 중 단 4홀에만 있어 초보자나 여성 골퍼에게도 부담이 덜하며, 대신 바람과 벙커, 그리고 미묘한 경사로 전략성을 높였습니다');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '2,500바트 / 캐디,카트 별도(플레이어 카트 쉐어 가능)', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Subhapruek Golf Club (close Mon)', '수파프룩 컨트리 클럽', 'TH', 'BKK', 18, '102 Moo 7, Bangna-Trad Road (Km 26), Ban Bang Bo, Samut Prakan 10560, Thailand', '6627056262', 'https://subhapruekgolf.com/', 5, 'W', NULL, 'Pete Dye', 'N', 2, 'N', NULL, NULL, 40, 'https://maps.app.goo.gl/vMLfCuVinSJYgf9L6', '세계적인 설계가 피트 & 페리 다이(Pete & Perry Dye)**가 설계한 18홀 파 72 챔피언십 코스로, 논과 습지 위에 세심하게 구성된 시각적으로 아름답고 전략적인 레이아웃을 자랑합니다. 페어웨이는 야자수가 줄지어 조성되어 있으며, 정교하게 디자인된 벙커와 거의 모든 홀에 배치된 물 해저드, 그리고 고목 나무들이 조화를 이루어 도전적이면서도 자연 친화적인 환경을 제공합니다. 코스 전장은 백티 기준 약 6,837야드이며, 잔잔한 언듈레이션과 함께 바람이 더해져 정밀한 샷이 요구됩니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '600', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Suwan Golf & country_code Club', '수완 골프 앤 컨트리 클럽', 'TH', 'BKK', 18, '15/3 Moo 2, Tha Phraya (Srisathong), Amphoe Nakhon Chai Si, Nakhon Pathom 73120, Thailand', '66819443662', 'https://www.suwangolf.com/home/', 5, 'Y', NULL, 'Weeyos Design', 'H', 3, 'N', '파스팔럼', '미니베르데 울트라드워프 버뮤다', 90, 'https://maps.app.goo.gl/akdGTfkM5VW7eKZy9', '수완 골프 & 컨트리 클럽은 챔피언십 티에서 7100야드가 넘는 길이로 플레이되며, 코스의 질, 언덕이 많은 레이아웃, 드라마틱한 경사가 진 그린을 갖추고 있어 수완 골프 앤 컨트리 클럽이 세계적인 명성을 얻은 이유를 상기시켜 줍니다.
수완 골프 & 컨트리 클럽은 방콕 골프 패키지의 일부로 꼭 플레이해야 할 곳입니다. 수완(Suwan)에서 플레이하고 가장 뛰어난 골프 전문가들의 발자취를 따라가보세요!');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '라운딩 요금의 100% 금액 / 골프백이 반드시 필요 / 빈 골프백 렌탈 요금 300바트', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Thai country_code Golf & country_code Club  (close mon)', '타이 컨트리 클럽', 'TH', 'BKK', 18, '88 Moo 1, Bangna-Trad Road. Km 35.5, Pimpa, Chachoengsao, 24180, Thailand', '6638562700', 'https://www.thaicountry_codeclub.com/', 4, 'N', NULL, 'Denis Griffiths', 'L', 3, 'N', '파스팔럼', '울트라 드워프 버뮤다', 40, 'https://maps.app.goo.gl/Z8V8RrcjaAEJDebo8', 'Tiger Woods가 우승한 1997년 Asian Honda Classic이 열린 태국 최고의 명문골프장, 타이 컨트리 클럽!
수많은 수상 경력을 자랑하는 이 클럽은 정기적으로 아시아 최고의 클럽으로 선정되었고, 세계 최고의 골퍼들이 참여하는 수많은 국제 및 국내 토너먼트를 개최하였습니다. 미국 골프장 건축가 협회 회장이었던 데니스 그리피스에 의해 PGA 경기 규격에 맞춰 설계된 디자인은 일상적인 캐주얼 플레이부터 세계 최고의 선수들이 도전하기에 부족함이 없습니다. 7,097야드 전장의 그림 같은 코스는 다양한 스타일의 해저드, 신고전적인 건축 디자인으로 유명하며 끊임없는 도전과 즐거움을 제공합니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', 'N', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Thana city_code country_code Club', '타나 시티 골프 앤 컨트리 클럽', 'TH', 'BKK', 18, '100/1 Bangna-Trad Frontage Road, Bang Chalong, Bang Phli District, Samut Prakan 10540, Thailand', '6621722300', 'https://www.thanacity_codecountry_codeclub.com/', 5, 'Y', NULL, 'Greg Norman', 'L', 2, 'N', '조이시아', '프리모 조이시아', 20, 'https://maps.app.goo.gl/eCbPgpFSiReEuCtD7', '호주의 전설적인 프로골퍼 그렉 노만이 1993년에 설계한 태국 유일의 골프장으로 수완나품 공항에서 12분, 방콕 시내에서 30분 정도로 접근성 매우 뛰어납니다. 넓은 페이웨이와 그린이 자칫 쉬운 느낌을 주는데, 그린 주변의 해저드와 깊은 벙커는 전략적인 샷을 요구합니다. 모든 클럽을 사용하게끔 해주는 잘 관리된 상급 골프장으로, 방콕을 찾는 골퍼들에게 기억에 남을 골프 경험을 제공합니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '주중 1000바트, 주말 1500바트 / 의무 카트 800바트 / 의무 캐디 400바트', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('The Royal Golf & country_code Club', '로얄 골프 앤 컨트리 클럽', 'TH', 'BKK', 18, '69 Moo 7, On-Nuch Rd, Lat Krabang, Samut Prakan, Bangkok 10520, Thailand', '6627381010', 'https://theroyalgolf.com/', 5, 'W', NULL, 'Chohei Miyazawa', 'H', 2, 'N', '조이시아', '울트라 드워프 버뮤다', 25, 'https://maps.app.goo.gl/QLEr5b5rEaFwtBHR6', '18홀 파72 챔피언십 코스로, 일본의 설계가 미야자와 초헤이가 자연 환경을 보존하며 설계한 명작으로 평가받고 있습니다. 7,050야드 이상의 전장은 넓고 요철이 있는 페어웨이, 계단식 그린, 수로와 호수가 조화를 이루며 전 홀에 전략적인 플레이를 요구하는 복합적 레이아웃으로 구성되어 있습니다. 특히 파 3 포맷 홀이 길고 도전적일 뿐 아니라, 12번 홀 ‘The Monster of Lat Krabang’과 16번의 미키마우스 벙커 등 인상적인 전략적 특징이 라운딩의 재미를 더해 줍니다. 수많은 수변 장애물과 언듈레이션, 빠른 그린 컨디션 덕분에 기술적 도전을 즐기는 골퍼에게 특히 사랑받는 코스입니다');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '그린피의 100% / 카트동승 가능 / 카트이용시 700바트추가', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('The Royal Gems Golf & Sports Club (Salaya)', '더 로얄 젬스 골프 앤 컨트리 클럽 살라야', 'TH', 'BKK', 18, '98 Moo 3, Salaya-Bangpasi Road, Tambon Salaya, Amphoe Phutthamonthon, Nakhon Pathom 73170, Thailand', '6624298066', 'http://www.royalgemsgolf.com/', 5, 'Y', NULL, 'Gary Roger Baird', 'L', 3, 'N', '파스팔럼', '티프이글 버뮤다', 75, 'https://maps.app.goo.gl/DnqHXoy9uBWFhgPN7', '1989년 Gary Roger Baird가 설계했으며, 블루 티 기준 최장 7,000야드를 넘는 규모로 골퍼들에게 강한 인상을 남깁니다. “The Crown Jewel”이라는 별명처럼 아름답고 완성도 높은 코스 디자인과 세심한 관리로 많은 골퍼들의 사랑을 받고 있습니다. 뛰어난 환경과 도전적인 레이아웃 덕분에 초보자부터 프로까지 모두에게 잊지 못할 라운딩 경험을 선사합니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '1,000바트 / 의무카트피 1,000바트추가', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('The Vintage club', '더 빈티지 클럽', 'TH', 'BKK', 18, '549/1–4 Moo 3, Panviti Road, Tambon Khlong Dan, Amphoe Bang Bo, Samut Prakan 10550, Thailand', '6620884999', 'https://www.vintagegolfthai.com/golf/index.php/en/', 6, 'W', NULL, 'Arthur Hills & Associates', 'H', 2, 'N', '티프웨이 419', NULL, 40, 'https://maps.app.goo.gl/kx52kU21jKzbz8WZ9', '1996년에 개장한 파크랜드 스타일 골프 코스로 미국의 유명 골프 코스 설계사 Arthur Hills & Associates가 태국 전통의 자연 환경과 서양식 코스 디자인을 절묘하게 결합했습니다. 코스는 18홀 파 72, 전장 약 6,720야드이며, 완만한 언듈레이션과 넓은 페어웨이를 바탕으로 초보자부터 숙련된 골퍼까지 모두 즐길 수 있는 균형 잡힌 난이도를 제공합니다. 하지만 13개의 홀에 워터해저드가 있어 방심할 수 없으며, 특히 바람이 강한 날에는 정확한 클럽 선택과 탄도 조절이 필수입니다. 코스 주변에는 부겐빌레아 꽃, 갈대 습지, 야자수 등이 어우러져 뛰어난 경관을 자랑하며, 계절에 따라 색다른 분위기를 느낄 수 있습니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '500/1000', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Thanya Golf Club', '탄야 컨트리 클럽', 'TH', 'BKK', 18, '26/13 Moo 3, Lamluka Soi 71, Lamluka Road, Lat Sawai, Amphoe Lam Luk Ka, Pathum Thani 12150, Thailand', '6625601136', 'https://www.thanyagolf.com/', 5, 'Y', NULL, 'Dr. Sukit Khranwisai', 'N', 1, 'N', '티프웨이 420', '노보텍스', 30, 'https://maps.app.goo.gl/A3wBQSYB3n8Mthxs6', '27홀 규모의 평탄하고 걷기 편한 코스로, 초보자부터 상급자까지 모두 즐길 수 있는 접근성 좋은 골프장입니다. 1990년대 초 Dr. Sukit Khranwisai가 설계했으며, 2012년 전면 리노베이션을 거쳐 세 가지 개성 있는 9홀 레이아웃을 갖추고 있습니다. 코스 곳곳에 배치된 호수와 완만한 바람이 어우러져 시각적 아름다움과 전략적인 플레이를 동시에 제공합니다. 그린에는 노보텍스 잔디, 페어웨이에는 티프웨이 419 버뮤다를 사용하여 연중 쾌적한 상태를 유지하며, 현대식 관개 시스템이 이를 뒷받침합니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '450', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('The Pine Golf & Lodge', '더 파인 골프 앤 롯지', 'TH', 'BKK', 18, '39 Moo 8, Sangkha Santi Suk Road, Krathum Rai, Nong Chok, Bangkok 10530, Thailand', '6621783664', 'https://www.facebook.com/thepinegolf/?locale=th_TH', 5, 'Y', NULL, 'V-Entertain', 'N', 1, 'N', NULL, NULL, 40, 'https://maps.app.goo.gl/nAS2knU2MdAszfcY6', '2005년에 개장한 18홀 파 72 파크랜드 스타일의 골프 코스와 숙박 시설을 겸비한 리조트형 골프장입니다. 코스 전장은 블루 티 기준 약 6,917야드로, 초보자도 편안하게 플레이할 수 있는 넓은 페어웨이를 갖췄지만, 언듈레이션이 있는 빠른 그린과 곳곳에 배치된 물 해저드·벙커가 전략성을 높입니다. 특히 파인 나무들이 각 홀을 감싸 경관이 뛰어나고, 바람이 불면 티샷과 세컨드 샷 선택이 까다로워집니다. 시그니처 홀은 12번 파 3로, 좌측 연못과 우측 벙커 사이를 공략해야 하며, 17·18번 홀은 물을 넘기는 장타가 요구돼 라운드 후반까지 긴장감을 유지하게 합니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '400/600', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('The Royal Gems city_code Golf Club', '더 로얄 젬스 골프 클럽 (랑싯)', 'TH', 'BKK', 18, '101/1 Moo 3, T. Rangsit, A. Thanyaburi, Pathum Thani 12110, Thailand', '6625778500', 'https://rggolfcity_code.com/', 5, 'Y', NULL, 'Ron Garl', 'L', 3, 'N', '파스팔럼', NULL, 45, 'https://maps.app.goo.gl/eBhfTta65Zep1SJB9', '"Masters, 오거스타 내셔널의 백 9홀과
세계 유명 골프장의 9개 시그니처 홀의 재현

더 로얄 젬스 시티 골프 클럽은 아시아 최초의 복제 코스로 세계 유명 골프 코스의 시그니처 9개 홀과 오거스타 내셔널의 백 9개 홀을 결합하여 탄생하였습니다. 코스 디자이너 Ron M. Garl은 단순한 복제에서 그치지 않고 세계적인 홀들에 영감을 받고 그만의 스타일로 재해석하여 원작과는 또 다른 감흥을 구현하였습니다. 넓고 아름다운 페어웨이와 깊고 전략적인 벙커 배치, 빠른 그린으로 골퍼들에게 다양한 기술을 요구하는 도전적이고 매력이 넘치는 태국 최고 명문 골프 코스입니다."');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', 'N', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Uniland Golf & country_code Club', '유니랜드 골프 앤 컨트리 클럽', 'TH', 'BKK', 18, '9/4 Moo 3, Tambon Wang Yen, Mueang Nakhon Pathom, Nakhon Pathom 73000, Thailand', '6634243444', 'http://www.unilandgolf.com/', 5, 'Y', NULL, 'Local Design', 'N', 1, 'N', NULL, NULL, 105, 'https://maps.app.goo.gl/vokp1VKQQQ3SyaFH8', '1996년 O‑Art Architects가 설계하여 개장한 27홀, 파 72 파크랜드 스타일 골프장으로,  세 개의 9홀 코스(Course A, B, C)가 각각 숲과 수면이 조화된 레이아웃, 길고 도전적인 홀을 포함한 구조, 그리고 언듈레이션과 경사진 지형 등 서로 다른 난이도와 특성을 제공하며 플레이의 다양성을 더합니다. 코스 전체는 빠르게 롤링되는 그린이 특징이며, 특히 파 5, 641야드에 이르는 코스 B의 8번 홀은 태국 내에서도 손꼽히는 긴 구성이자 시그니처 홀로 골퍼들의 도전욕을 자극합니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '갤러리피 없음', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Unico Grande Golf  Club', '유니코 골프 코스', 'TH', 'BKK', 18, '2 Krungthepkreetha Road, Sapansung, Bangkok 10250, Thailand', '6621388319', 'https://www.unicograndegolf.com/', 5, 'Y', NULL, 'Navy LT General Lek Smith', 'N', 1, 'N', NULL, NULL, 20, 'https://maps.app.goo.gl/C8vzYTtjSP5tb9uP8', '1968년에 Navy Lt. General Lek Sumith가 설계하고 개장한, 방콕 도심에서 약 20분, 수완나품 공항에서는 불과 10분 거리에 위치한 오랜 전통의 18홀 파 70 코스입니다. 비교적 짧은 전장이지만, 전략적으로 배치된 벙커와 워터 해저드가 각 그린을 효과적으로 수비하며, 잘 관리된 언듈레이션 그린은 샷 정확성과 클럽 선택을 요구합니다. 저렴한 그린피와 평탄한 페어웨이, 넉넉한 러프 디자인 덕분에 초심자도 무리 없이 플레이할 수 있습니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '800바트 / 카트이용시 600바트추가', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Windsor Park & Golf Club', '윈저 파크 앤 골프 클럽', 'TH', 'BKK', 36, '46 Moo 8, Suwintawong Road (km 9), Kokfad, Nong Chok, Bangkok 10530, Thailand', '6629894200', 'https://www.windsorgolf.co.th/', 6, 'Y', NULL, 'Ronald Fream & David Dale', 'N', 1, 'N', NULL, NULL, 30, 'https://maps.app.goo.gl/MjNwYDVQ3wojvqGV8', '1994년에 Ronald Fream과 David Dale이 디자인한 코스로 넓은 페어웨이, 다채로운 수로, 나무가 늘어선 전형적인 파크랜드 스타일 레이아웃으로 구성되며, A, B, C 9홀과 2006년에 추가된 D 9홀이 조화롭고도 도전적인 조합을 형성합니다. 전반적으로 페어웨이는 넓지만, 워터 해저드가 홀 대부분에 걸쳐 배치되어 있어 방향성이 중요하며, 벙커 또한 깊고 전략적으로 위치해 있습니다. 특히 D 코스는 인공호수를 둘러싼 설계로, 바람의 영향을 크게 받으며 티샷과 세컨드 샷의 정확성이 승부를 가릅니다. 그린은 빠른 편이지만 롤이 일정하여 퍼팅 감각을 잘 맞추면 좋은 스코어를 기대할 수 있습니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '700', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Ekachai Golf & country_code Club', '에카차이 골프 앤 컨트리 클럽', 'TH', 'BKK', 18, '8 Moo 5, Ekachai Road, Tambon Bangnamchued, Amphoe Mueang, Samut Sakhon 74000, Thailand', '66851210272', 'https://ekachaigolfclub.com/', 5, 'Y', NULL, 'Mr.Gray Gerry Nazch', 'N', 1, 'N', NULL, NULL, 60, 'https://maps.app.goo.gl/4Yeh4WqwVeZyt2t86', '1982년 오픈한  27홀 파 72 파크랜드 스타일 코스로, 수많은 언덕과 워터 해저드가 코스를 감싸 정확한 샷과 전략적 클럽 선택을 요구합니다. 평탄한 지형과 다양한 홀 구성은 경험 수준을 불문하고 모든 골퍼에게 균형 잡힌 도전을 제공합니다. 지형이 평탄해 걷기에 수월하며, 풍부한 수목이 그늘을 제공해 여유로운 플레이가 가능한 반면, 워터 해저드의 다수 배치로 스페어 볼이 필요할 정도로 전략적 집중이 요구됩니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '500', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Watermill Golf & Garden', '워터밀 골프 앤 가든', 'TH', 'BKK', 18, '44 Moo 2, Pho Thaen Sub-district, Ongkharak District, Nakhon Nayok 26120, Thailand', '6625491555', 'https://www.watermillgolf.com/official/?r=Site/Index', 4, 'Y', NULL, 'Mr. Jay Rabert Savastano', 'N', 3, 'N', NULL, NULL, 70, 'https://maps.app.goo.gl/kLXUHAo82UCcAGof9', '1991년에 개장한 18홀, 파 72 챔피언십 코스로 평탄한 지형 속에 다양한 워터 해저드가 전략적으로 배치되어 있습니다. 특히 11번 홀의 아일랜드 그린은 코스의 상징적인 시그니처 홀로, 바람과 물을 모두 고려한 정밀한 샷이 요구됩니다. 또한, 나머지 홀들도 대부분 물이 플레이 라인에 개입하기 때문에 초보자에게는 도전적이고, 숙련자에게는 샷 메이킹의 재미를 제공합니다. 이곳은 태국 PGA 투어, 아시아 아마추어 대회, 2007 유니버시아드 골프 경기, 그리고 주니어 챔피언십 등 다양한 대회를 개최해 온 공식 경기장으로, 그린과 페어웨이 관리 수준이 일정하게 유지됩니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '갤러리 피 없음, 캐디 + 카트 의무사용으로 갤러리 요청 시 950바트 추가비용이 발생함.', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Wangnoi Prestige Golf And country_code Club', '왕너이 프레스티지 골프 앤 컨트리 클럽', 'TH', 'BKK', 18, '99/1 Moo 10, Bo Ta Lo, Wang Noi District, Phra Nakhon Si Ayutthaya 13170, Thailand', '66811610041', 'https://www.facebook.com/wangnoi.ayudhaya/?locale=th_TH', 5, 'Y', NULL, 'Mr. Vera Tanakonpakdee', 'N', 3, 'N', NULL, NULL, 60, 'https://maps.app.goo.gl/VN4wcKqdbHc43edx8', '원래는 무앙 아케 골프 코스였으나, 2017~2018년 대규모 리노베이션을 거쳐 새로운 코스 레이아웃과 현대적인 시설을 갖춘 프리미엄 골프장으로 재개장했습니다. 코스는 18홀 파 72, 총 전장 약 7,238야드로, 설계는 베라 타나콘팍디(Vera Tanakonpakdee)가 맡아 평탄한 지형에 전략적 요소를 풍부하게 더했습니다. 모든 홀에 워터 해저드가 배치되어 있어 방향성과 거리 조절이 필수이며, 벙커도 깊고 효과적으로 위치해 있어 공략이 쉽지 않습니다. 특히 시그니처 홀인 17번 파 5(568야드)는 왼쪽으로 물이 길게 이어지고, 페어웨이가 좁아져 장타보다는 안전한 레이업이 유리합니다. 바람이 불 경우 세컨드 샷에서 어려움이 더해져 스코어 메이킹의 분수령이 되는 홀입니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '300', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Bangpakong Riverside country_code Club', '방파콩 리버사이드 컨트리 클럽', 'TH', 'BKK', 18, '35/5 Moo 6, Saen Phu Dat, Ban Pho District, Chachoengsao 24140, Thailand', '6638500500', 'https://brc-kycgolf.com/', 5, 'W', NULL, 'Chird Booyaratevej', 'N', 2, 'N', NULL, NULL, 40, 'https://maps.app.goo.gl/eGR6ERV2HWPC7kGq9', '1990년 설립된 18홀, 파 72 챔피언십 코스로, 넓고 평탄한 페어웨이와 드넓은 수변 경관이 특징인 친환경 파크랜드 스타일 코스입니다. 골프장은 지역 생태를 존중하는 ‘그린 유지 관리’를 실천하며, 필드 곳곳에 열대 야자수, 꽃밭, 연못과 드라마틱한 벙커가 조화를 이루어 시각적 쾌적함과 전략성을 동시에 제공합니다. 티샷 난이도는 비교적 낮지만, 방파콩 강에서 불어오는 바람과 물이 전략적으로 적용되는 파3 홀들은 특히 플레이어에게 깊은 도전을 안겨 줍니다. 초보자부터 상급자까지 모두 즐길 수 있는 균형 잡힌 구성의 코스로, 특히 자연과 조화를 이루는 편안한 라운딩을 원하는 골퍼들에게 높은 만족도를 주는 골프장입니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '500/800', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Ban Rakat Club', '반 라깟 클럽', 'TH', 'BKK', 18, '199-200 Moo 5, Bangna-Trad Rd., Km29, Bang Bo District, Samut Prakan 10560, Thailand', '6620608500', 'https://www.brc.co.th/', 4, 'Y', NULL, 'Gil Hanse', 'L', 3, 'N', NULL, NULL, 30, 'https://maps.app.goo.gl/QVSkqGbdnp46Cs8y6', '2021년 개장한 18홀, 파 71 링크스 스타일의 프라이빗 챔피언십 코스로 세계적인 코스 설계가 길 핸스가 설계했습니다. 이 코스는 전설적인 Lido Golf Club의 오리지널 홀이 갖고 있던 설계 철학을 토대로 각 홀이 재해석되어 구성되었으며, 레드안(Redan), 에덴, 비아리츠 등 역사적 템플릿 홀이 그대로 반영되어 있습니다. 코스는 넓은 수공간, 구릉 그린, 블라인드 샷 등 링크스 고유의 전략적 재미와 시각적 아름다움을 동시에 제공하며, 공략에는 캐디 조언이 매우 중요한 역할을 코');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', 'N', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Lotus Valley Golf Resort', '로터스 밸리 골프 리조트', 'TH', 'BKK', 18, '103/1-5 Moo 8, Donkohka, Bangnamprieo, Chachoengsao 24170, Thailand', '6638835555', 'https://www.facebook.com/lotusvalleygolfresort', 5, 'W', NULL, 'Gary Player', 'N', 2, 'N', '파스팔럼', '씨아일 2000', 60, 'https://maps.app.goo.gl/DJumBvPC2GjabJoH8', '남아공의 전설적 골퍼, 게리 플레이어가 디자인18홀 파 72 챔피언십 코스(전장 약 7,015야드). 2008년 코스 리노베이션을 거쳐, 전략적 난이도와 시각적 완성도를 모두 갖춘 명성 높은 레이아웃으로 재탄생했습니다. 전 홀에 물이 등장하며 스코틀랜드 전통 링크스를 연상시키는 타이트하게 잘 깎인 페어웨이, 정교한 벙커, 그린 주변의 면밀한 디자인을 특징으로 합니다. 또한, 바람의 영향을 많이 받는 개방형 홀과, 나무와 수공간이 둘러싼 밀폐형 홀이 번갈아 배치되어 변화를 줍니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '800', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Burapha Golf & Resort', '부라파 골프 앤 리조트', 'TH', 'UTP', 36, '281 Moo 4, Bueng (Bo Win), Si Racha District, Chonburi 20230, Thailand', '66383727002', 'https://www.facebook.com/people/Burapha-Golf-Resort-Thailand/100057382482955/', 4, 'Y', NULL, 'David Graham & Gary Panks', 'H', 3, 'N', '조이시아', '티프이글 버뮤다', 80, 'https://maps.app.goo.gl/e8nAfGLQprH5PGCr6', '부라파 골프 앤 리조트는 존경받는 건축가 Gary Panks와 세계적으로 유명한 여행 전문가 David Graham이 설계한 가장 흥미롭고 혁실적인 총 36홀의 골프 클럽입니다. 동코스는 미국식으로 아늑한 정원 분위기, 난이도가 높은 서코스는 황량한 스코틀랜드 풍을 느낄 수 있습니다. 그린이 절묘한 위치의 언덕위에 놓여있고 업다운이 상당히 많아 모든 골퍼들이 재밌게 게임을 즐길 수 있습니다. 도전을 즐기는 상급골퍼는 B-D코스, 편안한 게임을 원하시면 코스 A-C 라우팅을 요청하세요.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '500', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Bangpra International Golf Club', '방프라 인터내셔널 골프 클럽', 'TH', 'UTP', 18, '45 Moo 6, Bangpra, Si-Racha District, Chonburi 20110, Thailand', '66812956154', 'https://www.facebook.com/BangpraGolfClubAndResort/', 5, 'W', NULL, 'Japan Golf', 'N', 2, 'N', '조이시아', '티프이글 버뮤다', 90, 'https://maps.app.goo.gl/8zpLhGJ8gKPzzC2E7', '1958년에 개장한 파타야 지역에서 가장 오래된 골프장 중 하나로, 1980년대 후반에 전면 리노베이션을 거쳐 현대적인 챔피언십 코스로 변모했습니다. 페어웨이가 울창한 숲과 열대식물로 둘러싸인 파크랜드 스타일이며, 낮은 언듈레이션과 여유로운 흐름으로 초보자에게도 적합하지만, 빠른 그린과 전략적 물 해저드, 깊은 벙커가 숙련자에게는 도전 요소를 제공합니다. 특히 파 3 홀 중 청 티 기준 180야드를 초과하는 긴 구성의 홀이 많고, 17번 홀은 약 200야드를 넘어가는 강력한 워터 캐리가 생략된 도전적인 레이아웃으로 강한 인상을 남깁니다');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '500', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Chee Chan Golf Resort', '치찬 골프 리조트', 'TH', 'UTP', 18, '108/18 Moo 6, Na Jomtien, Sattahip, Chonburi 20250, Thailand', '6638196555', 'cheechangolf.com', 4, 'N', NULL, 'David Dale from Golf Plan', 'L', 3, 'N', '조이시아', '티프이글 버뮤다', 90, 'https://maps.app.goo.gl/eHLUS9an7jjojacg9', '2018년 11월 오픈한 치찬 골프 리조트는 파타야의 고급 골프 클럽을 표방한 18홀 챔피언쉽 코스를 가진 골프장 입니다. 고급스러운 시설과 서비스, 잘 관리된 코스로 나날이 인기를 더해 가고 있습니다.
총 18홀 규모의 코스로 전체적으로 전장이 긴 편입니다. 워터 헤저드나 OB는 적으나, 코스 곳곳에 있는 벙커를 피해야 하며, 무엇보다 넓은 그린을 가지고 있어 쉽게 온을 할 수 있으나 핀에 붙이지 못한다면, 부담스러운 초장거리 퍼팅을 해야 할 수 있습니다.
유명한 카오치찬(Khao Chee Chan) 부처의 그림자 속에 위치하며, 파타야, 좀티엔, 태국만의 전망을 제공하는 치찬클럽은 눈이 즐거운 골프클럽입니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '1500', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Crystal Bay Golf Club', '크리스탈 베이 골프 클럽', 'TH', 'UTP', 27, '502 Moo 10, Sukhumvit Road, Bang Phra, Si Racha, Chonburi 20210, Thailand', '66383493704', 'https://www.facebook.com/269702259822661/', 5, 'Y', NULL, 'Thai Takenaka', 'N', 2, 'N', NULL, NULL, 70, 'https://maps.app.goo.gl/csrt3Hgt3t6LaiQr8', '"1988년 토미야마 다케나카의 설계로 개장한  27홀, 파 72 챔피언십 코스로 A, B, C 세 개의 9홀 루프로 구성되어 있으며, 구릉 지형과 전략적으로 배치된 워터 해저드, 그리고 링크스와 파크랜드 스타일이 조화를 이루는 레이아웃이 특징입니다. 특히 3번 홀(파 4 도그레그)과 8번 홀(파 3 아일랜드 그린)은 물을 넘기거나 사이드 해저드를 고려한 플레이가 요구되는 상징적인 시그니처 홀로 각광받습니다 
‘하와이안 링크스 스타일’로 자주 묘사되며, 울창한 야자수와 완만한 언듈레이션 덕분에 이국적인 분위기를 자아내며, 전반적으로 난이도는 무난하지만 정확도를 요구합니다"');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '500', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Mountain Shadow Golf Club', '마운틴 쉐도우 골프 클럽', 'TH', 'UTP', 18, '159/1 Moo 2, Saen Suk Road, Mueang District (Muang), Chonburi 20130, Thailand', '6638393001', 'https://www.facebook.com/golfddcom/posts/mountain-shadow-golf-club-%E0%B8%88%E0%B8%8A%E0%B8%A5%E0%B8%9A%E0%B8%B8%E0%B8%A3%E0%B8%B5/2092115860883041/', 5, 'Y', NULL, 'Golfplan - Ronald Fream & David Dale', 'N', 1, 'N', NULL, NULL, 65, 'https://maps.app.goo.gl/jktBQGoRYNsW4hoW8', '18홀, 파 72 챔피언십 코스로, 1993년 Ronald Fream과 David Dale이 설계했으며 2004년 리노베이션을 거쳐 현대적 감각을 더했습니다. 원래 망고 농장이었던 부지를 기반으로 조성된 이 코스는 주변 언덕과 풍부한 수목이 자연 배경을 이루며, 각 홀마다 꽃과 나무가 어우러진 시각적 매력을 선사합니다. 페어웨이는 좁고 야자수로 둘러싸여 있으며, 언듈레이션이 심한 지형과 빠르고 기복 있는 그린으로 정확한 티샷과 퍼팅 전략이 요구됩니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '500', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Eastern Star country_code Club', '이스턴 스타 컨트리 클럽', 'TH', 'UTP', 18, '241/5 Moo 3, Pla (Phla), Ban Chang District, Rayong 21130, Thailand', '66863776722', 'https://easternstargolfcourse.com/', 5, 'N', NULL, 'Robert Trent Jones Jr.', 'N', 2, 'N', NULL, NULL, 90, 'https://maps.app.goo.gl/yWFyajZ2s889h5uL8', '세계적인 골프 설계자 로버트 트렌트 존스 주니어가 디자인한 18홀 파 72 챔피언십 코스로, 야자수와 열대수목이 둘러싸인 파크랜드 스타일 레이아웃을 특징으로 하며, 전 구간에 걸쳐 65개 이상의 벙커와 11개의 호수가 전략적으로 배치되어 있습니다. 페어웨이는 비교적 넓지만, 바람과 물 해저드가 라운드 난이도를 높이며, 빠른 그린과 정교한 어프로치가 요구됩니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '500', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Greenwood Golf Club', '그린우드 골프 클럽', 'TH', 'UTP', 27, '88/8 Moo 6 (Tambon Khlong Kiew), Ban Bung District, Chonburi 20220, Thailand', '66898338948', 'http://www.gwgolfclub.com/', 5, 'W', NULL, 'Peter Thomson', 'N', 2, 'N', NULL, NULL, 75, 'https://maps.app.goo.gl/pACZHaBp82YnG9p77', '세계적인 코스 설계가 피터 톰슨과 마이클 울프가 디자인한 A, B, C 세 개의 9홀 코스는 각각 독창적인 레이아웃과 도전적인 요소를 갖추고 있으며, 완만한 언듈레이션 지형과 전략적으로 배치된 벙커, 호수가 조화를 이룹니다. 열대 수목과 야자수로 둘러싸인 코스는 자연 친화적인 분위기 속에서 라운드를 즐길 수 있으며, 시즌에 따라 다양한 야생화와 잔디 색감 변화가 시각적 매력을 더합니다. 페어웨이는 비교적 넓지만, 빠른 그린과 바람, 다수의 도그레그 홀이 정확한 샷 메이킹을 요구합니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '1,300바트 / 카트 동승불가 (카트, 캐디 의무포함)', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Khao Kheow country_code Club', '카오 키여우 컨트리 클럽', 'TH', 'UTP', 27, '220/15 Moo 12, Bang Phra, Si-Racha District, Chonburi 20210, Thailand', '6638318000', 'http://www.khaokheowgolf.com/', 5, 'N', NULL, 'Pete Dye', 'N', 1, 'N', NULL, NULL, 70, 'https://maps.app.goo.gl/EsQrjeALZSJDY2uM6', '구릉 지대에 위치한 27홀 챔피언십 코스로, 세계적인 골프 코스 설계가 피트 다이가 디자인했습니다. 각각의 코스는 독창적인 난이도와 풍경을 제공하며, 전 구간에서 호수, 강, 습지대가 어우러져 전략적인 플레이가 필요합니다. 특히 언듈레이션이 심한 페어웨이와 다단 그린, 깊은 벙커가 조화를 이루어 정확한 샷과 코스 매니지먼트가 필수적입니다. 주변의 카오 키여우 산맥과 야생동물 보호구역이 어우러져 라운드 중에도 자연경관을 만끽할 수 있습니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '500', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Laem Chabang International country_code Club', '람차방 인터내셔널 컨트리 클럽', 'TH', 'UTP', 27, '106/8 Moo 4, Bueng (Beung), Si Racha District, Chonburi 20230, Thailand', '66822223031-3', 'http://www.laemchabanggolf.com/', 5, 'Y', NULL, 'Jack Nicklaus', 'H', 2, 'N', '파스팔럼', '울트라 드워프 버뮤다', 90, 'https://maps.app.goo.gl/bQjoV8UrZqsQBktLA', '잭 니클라우스가 설계한 람차방 인터내셔널 컨트리 클럽에서는 누구나 자연과 가까워진 느낌을 즐길 수 있습니다. 이 세계적 수준의 골프 코스는 (총 27홀), Mountain 9의 아름다운 언덕, Lake 9의 많은 호수와 하천, Valley 9의 그림 같은 풍경, 코스마다 색다른 골프를 느끼게 해드립니다.
코스 주변에 어우러진 거대한 바위 언덕에 호수와 연못이 더하여져 이루어진 코스는 아름다운 뷰 뿐만 아니라 골퍼들을 긴장하게 만드는 주요 장애물로 작용하여 많은 골프 애호가들에게 호평을 받고 있습니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '600', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Pattana Golf Club & Resort', '파타나 골프 클럽 앤 리조트', 'TH', 'UTP', 27, '99/89 Moo 9, Highway 331, Si Racha, Chonburi 20110, Thailand', '6638318999', 'https://www.pattana.co.th/', 5, 'Y', NULL, 'Gassan', 'H', 2, 'N', '티프웨이 419', '티프드워프 버뮤다', 80, 'https://maps.app.goo.gl/WShJNB4xrai4FCFy8', '파타나 골프 클럽 앤 리조트는 건강한 생활 방식을 추구하는 개인, 가족, 그룹을 위한 포괄적인 레크리에이션 스포츠 리조트입니다. 태국적인 느낌이 강하며, 코스는 레이스코스, 우드코스, 링크스코스 이렇게 3개 코스, 총 27홀로 구성되어 있습니다. 레이크코스는 이름 그대로 호수를 따라 이어지며, 호수와 하늘, 푸른 양탄자 같은 그린이 연출하는 아름다움을 만끽할 수 있습니다. 호수 풍경에 야자수가 운치를 더하는 우드코스는 골퍼들에게 편안함을 전해줍니다. 스코틀랜드 스타일로 조성된 링크스코스에는 호수와 모래가 절묘하게 조화를 이루며 파6, 663야드 6번홀은 장타자라면 큰 흥미를 가질 만한 인상적인 코스입니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '주중-500/주말-800/의무카트 700 + 캐디 400 (18홀 기준)', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Pattaya country_code Club', '파타야 컨트리 클럽', 'TH', 'UTP', 18, '55 Moo 2, Highway 331, Khao Mai Keaw, Bang Lamung District, Chonburi 20150, Thailand', '6638341149', 'https://www.pattayacountry_codeclub.com/', 5, 'Y', NULL, 'PGA (Thailand) Co., Ltd.', 'N', 1, 'N', NULL, NULL, 90, 'https://maps.app.goo.gl/oSuhUdSrVWPXw3B77', '1994년에 개장한 18홀 코스였으나, 이후 확장과 전면 리노베이션을 거쳐 현재는 오리지널 18홀과 추가 9홀로 구성되어 다양한 조합 플레이가 가능합니다. 기존 18홀은 비교적 평탄한 지형에 넓은 페어웨이, 크고 완만한 그린, 적당한 언듈레이션이 있어 초보자도 부담 없이 플레이 가능하고, 신설된 9홀은 워터 해저드, 깊은 벙커, 도그레그 홀 등 전략적인 요소가 많아 코스난이도가 높아 상급자에게 추천드립니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '500', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Phoenix Gold Golf & country_code Club', '피닉스 골드 골프 앤 컨트리 클럽', 'TH', 'UTP', 27, '111 Moo 9, Sukhaphiban 2 Road, Huai Yai, Bang Lamung District, Chonburi 20150, Thailand', '6638343365', 'https://www.phoenixgolfpattaya.com/', 5, 'Y', NULL, 'Dennis Griffiths', 'H', 3, 'N', '조이시아', '챔피언 울트라 드워프 버뮤다', 90, 'https://maps.app.goo.gl/yHHri6MsnH9g9bYN6', '총 27홀의 피닉스파타야 골프 코스는 오션, 레이크, 마운틴 코스가 각각 9개로 구성되어 있으며 주변 산과 태국만의 멋진 전망을 제공합니다. 페어웨이가 좁긴 하지만 그린은 아주 넓으며 중간 나인 홀에 워터 해저드가 많아서 장타자에게 아주 적합합니다. 레이크 코스는 수많은 워터해저드를 갖춰 태국 내에서 가장 어려운 코스로 꼽힙니다. 새로 지은 클럽 하우스와 깔끔한 관리상태, 수려한 경관이 더해져 동급의 다른 골프장에 비교 했을시 충분히 경쟁력 있으며, 오션 코스의 마지막 홀에서 파타야 바다의 모습을 내려다보는 멋진 골핑 추억을 만들어 보세요.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '500', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Pleasant Valley Golf & country_code Club', '프레젠트밸리 골프 앤 컨트리클럽', 'TH', 'UTP', 18, '41/62 Moo 9, Bang Phra Subdistrict, Si Racha District, Chonburi 20110, Thailand', '6638110778', 'https://www.pleasantvalleygolf.com/', 5, 'Y', NULL, 'Golf East', 'N', 2, 'N', '파스팔럼', '티프드워프 버뮤다', 1, 'https://maps.app.goo.gl/1YwrebtXRMKnHWrK8', '2009년 개장한 18홀, 파 72, 전체 길이 약 7,002야드의 파크랜드 코스로 수많은 연못과 늪, 자연림이 어우러져 경관이 뛰어난 반면, 곳곳에 위치한 워터 해저드와 도그레그 홀 덕분에 도전적인 플레이를 요구합니다. 3번 홀처럼 워터가 감싸는 도그레그 구조나 12번 홀의 약 200야드 워터 캐리를 비롯해, 마지막 18번 홀의 짧지만 전략적 도그레그 구성은 특히 인상적인 난이도를 제공합니다');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '500', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Pattavia Century Golf Club', '파타비아 센츄리 골프 클럽', 'TH', 'UTP', 18, '99/1 Moo 5, Klong Kiew (Khlong Kiu), Ban Bueng District, Chonburi 20220, Thailand', '6638318999', 'https://www.pattavia.co.th/', 5, 'Y', NULL, 'Robert McFarland', 'N', 1, 'N', NULL, NULL, 70, 'https://maps.app.goo.gl/u5HpoSfL5VzrSFM86', '1996년 미국 골프 설계가 로버트 맥팔랜드가 디자인한 18홀·파72, 약 7,100야드 규모의 파크랜드 레이아웃 골프장입니다. 2014년 창 맥주 회사가 인수 후 대대적인 리노베이션과 연장을 거쳐 현재의 이름과 깔끔한 클럽하우스를 얻게 되었습니다. 코스는 전원적인 계곡 지형과 파인애플 농장으로 둘러싸인 자연스러운 환경 속에 자리 잡고 있으며, 구릉과 도그레그, 그리고 빠르고 기복이 심한 그린이 특징적인 도전적인 레이아웃을 제공합니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '600', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Rayong Green Valley country_code Club', '라용 그린밸리 컨트리 클럽', 'TH', 'UTP', 18, '9/36 Moo 7, Samnuk Thon Subdistrict, Ban Chang District, Rayong 21130, Thailand', '6638110778', 'https://www.facebook.com/rayonggolf/', 5, 'N', NULL, 'Peter Thomson', 'H', 2, 'N', '울트라 드워프 버뮤다', '조이시아', 90, 'https://maps.app.goo.gl/Fh9sqzWfVbBGqGwf8', '1992년에 피터 톰슨과 마이클 울버리지에 의해 설계된 18홀, 파 72 규모의 파크랜드 스타일 골프 코스로, Pattaya와 Rayong 사이의 아름다운 전원 지대에 자리 잡고 있어 뛰어난 경관을 자랑합니다. 구릉과 바위 노출 지형을 그대로 살린 설계 덕분에 페어웨이의 굴곡, 바위 돌출, 언듈레이션이 많아 샷의 정확성이 요구되는 난이도 높은 코스로 평가받고 있습니다. 코스의 전반부, 특히 1번 홀은 긴 워터 캐리와 페어웨이의 언덕진 접근으로 시작부터 도전적이지만, 이후부터는 전반적으로 안정적인 레이아웃으로 플레이의 흐름이 조금씩 누그러집니다. 뛰어난 자연 경관, 도전적인 코스 디자인, 충실한 시설을 모두 갖춘 코스로 중급부터 고급 골퍼에게 모두 추천할 만한 장소입니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '500', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('St. Andrews 2000 Golf Course', '세인트 앤드류 2000 골프 코스', 'TH', 'UTP', 18, '9/36 Moo7 Samnakthon Ban Chang, Rayong 21130', '6638318999', 'https://www.facebook.com/p/StAndrews2000-100069361203328/', 5, 'N', NULL, 'Desmond Muirhead', 'H', 2, 'N', NULL, NULL, 90, 'https://maps.app.goo.gl/6jpt3pGSehU49UYS7', '고저차가 있는 구릉 지형 위에 설계된 이 코스는 높은 티박스와 그린, 좁은 페어웨이, 언듈레이션이 심한 페어웨이, 넓은 그린, 그리고 전략적으로 배치된 워터 해저드와 벙커로 구성되어 있어, 낮은 핸디캡을 가진 골퍼에게도 매우 도전적인 코스로 알려져 있습니다. 특히 800야드를 넘는 두 개의 파 6 홀(4번홀: 약 878야드, 13번홀: 약 861야드)은 이 코스만의 독특한 특징으로, 파타야 지역 골프 코스 중 가장 기억에 남는 경험을 제공합니다. 세인트 앤드류스 2000은 압도적인 규모와 독창적인 디자인을 갖춘 코스로, 도전적인 플레이를 원하는 골퍼에게 특히 추천할 만한 골프장입니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '400', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Silky Oak country_code Club', '실키 오크 컨트리 클럽', 'TH', 'UTP', 18, '9/36, Sam Nak Thon, Ban Chang District, Rayong 21130', '66819408181', 'https://www.facebook.com/rayonggolf/posts/silky-oak-country_code-club-booking-038-030-660-2-081-940-8181/1121888403073951/', 5, 'Y', NULL, 'Local Designer', 'N', 2, 'N', NULL, NULL, 90, 'https://maps.app.goo.gl/JZDsM8TUCDttoZ6R6', '2010년에 개장한 18홀 파72 골프장으로 이름처럼 호주산 실키 오크 나무가 페어웨이에 심어져 시각적 즐거움을 주며, 넓은 페어웨이와 크고 언듈레이션이 심한 그린으로 구성되어 미들~하이 핸디캡 골퍼에게 적합한 설계입니다. 페어웨이는 매우 넓어 대부분 샷이 편안하지만, 그린 주변의 심한 언듈레이션 때문에 단단한 숏게임 스킬이 필요하고, 페어웨이의 높낮이 변화와 8개 홀에서 등장하는 워터 캐리, 그리고 도그레그 홀 등은 기술적인 도전을 요구합니다. 코스 중간에 자리한 그늘집에서는 언덕 위에서 주변 전경을 한눈에 내려다볼 수 있어 휴식과 경관을 즐기기에 좋습니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '500', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Treasure Hill Golf & country_code Club', '트레저 힐 앤 골프 클럽 T', 'TH', 'UTP', 18, '222 Khlong Kiu, Ban Bueng District, Chon Buri 20220', '6638343365', 'http://www.treasurehill.co.th/', 6, 'Y', NULL, 'Yoshikazu Kato', 'N', 2, 'N', NULL, NULL, 90, 'https://maps.app.goo.gl/DA433zrhKydoruev9', '1994년에 개장한 18홀, 파 72 규모의 파크랜드 스타일 골프장으로 성숙한 나무와 식생이 둘러싸인 페어웨이는 조경적으로도 뛰어나면서도 전략적 플레이를 요구합니다. 코스는 처음에는 쉬워 보일 수 있으나, 도그레그 스타일 홀과 좁고 경사진 페어웨이, 그리고 크고 배치된 벙커들이 있어 정확한 티샷과 코스 매니지먼트가 핵심입니다. 완만한 언덕 지형을 따라 설계되어 있어 업힐·다운힐 샷이 자주 등장하며, 특히 시그니처 홀인 16번 파5, 크로커다일 홀은 왼쪽 연못 근처에 악어 조형물이 있어 시각적 재미와 함께 신중한 전략을 요구합니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '350', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Siam country_code Club Plantation', '시암 컨트리 클럽 플랜테이션', 'TH', 'UTP', 27, '50/6 Moo 9, Pong, Bang Lamung District, Chonburi 20150', '6638909700', 'https://www.siammotors.com/en/companies/', 4, 'N', NULL, 'Lee Schmidt and Brian Curley, USA', 'L', 3, 'N', '씨쇼어 파스팔럼', '노보텍 울트라 드워프 버뮤다', 90, 'https://maps.app.goo.gl/4eMnm9g891caV6vC9', '슈미트(Schmidt)와 컬리 디자인(Curley Design Inc.)이 설계한 시암 컨트리 클럽 파타야 플랜테이션 골프 코스. 이 코스에서는 파노라마 뷰로 자연의 아름다움을 감상하실 수 있습니다. 3개의 코스는 사탕수수, 타피오카, 파인애플 농장으로 명명되었습니다. 빠르고 기복이 있는 그린, 페어웨이는 넓은 편인데 장애물이 있어 초보골퍼들에게는 어려움이 있을 수 있습니다. 파타야에서 즐길 수 있는 최상의 골프장이라 할 만큼 긴 설명이 필요없는 골프장입니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '(카트 동승 시)2500바트', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Siam country_code Club Rolling Hills (close wed)', '시암 컨트리 클럽 롤링 힐스', 'TH', 'UTP', 18, '50/16 Moo 9, Pong, Bang Lamung District, Chonburi 20150', '6638909700', 'https://www.siammotors.com/en/companies/', 5, 'N', NULL, 'Schmidt-Curley Design, lnc', 'L', 3, 'N', '씨쇼어 파스팔럼', '노보텍 울트라 드워프 버뮤다', 90, 'https://maps.app.goo.gl/RhRvhaQf9sfNciZH6', '2019년 세계적인 골프 코스 설계사 Schmidt‑Curley (Brian Curley 디자인)에 의해 완성되어, 전통적이면서도 자연미가 뛰어난 레이아웃을 자랑합니다. 전반부 9홀은 넓고 개방적인 평지로 구성되어 있어 시원한 시야와 여유로운 플레이가 가능하지만, 후반부 홀들은 이름 그대로 “언덕(Rolling Hills)” 코스답게 고저차와 자연스럽게 조성된 대지의 언듈레이션이 특징이며, 전통적이면서도 세련된 위험과 보상의 요소들을 곳곳에 배치해 전략적인 플레이를 요구합니다. 전 코스를 아우르는 멋진 경관, 완벽한 코스 컨디션, 그리고 도전적 구성 덕분에 LPGA 등 국제 토너먼트 개최 후보로 이름을 올리고 있습니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '2500', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Siam country_code Club Old Course (close Mon)', '시암 컨트리 클럽 올드 코스', 'TH', 'UTP', 18, '50 Moo 9, Pong, Bang Lamung District, Chonburi 20150', '6638909700', 'https://www.siammotors.com/en/companies/', 4, 'N', NULL, 'Isao Mazumi, Schmidt-Curley', 'L', 3, 'N', '씨쇼어 파스팔럼', '노보텍 울트라 드워프 버뮤다', 90, 'https://maps.app.goo.gl/W5Sro7zbYBuTQLjr6', '1971년에 태국 최초의 프라이빗 골프장으로 문을 열었으며, 2007년에는 Schmidt‑Curley 팀에 의해 현대적인 챔피언십 수준으로 대대적인 리노베이션을 거쳤습니다. 2007년부터 LPGA 투어의 ‘혼다 LPGA 태국’을 개최해 세계적인 명문 골프장으로 발돋을 하였으며, 2018년에는 Golf Digest가 선정한 세계 73위 골프 코스로 이름을 올리기도 했습니다. 전통적인 아름다움과 품격 있는 코스 설계, 세계적인 대회 개최 이력, 그리고 뛰어난 코스 관리까지, 올드 코스는 태국 골프의 정수를 느낄 수 있는 대표적인 명문 코스입니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '2500', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Siam country_code Club Waterside (close Tue)"', '시암 컨트리 클럽 워터사이드', 'TH', 'UTP', 18, '50/10 Moo 9, Pong, Bang Lamung District, Chonburi 20150', '6638909700', 'https://www.siammotors.com/en/companies/', 4, 'N', NULL, 'IMG', 'L', 3, 'N', '씨쇼어 파스팔럼', '노보텍 울트라 드워프 버뮤다', 90, 'https://maps.app.goo.gl/ffNkPqHQk2t8Zsq38', '2014년 IMG Golf Course Design에 의해 설계된 18홀, 파 72 규모의 파크랜드 코스로 넓은 호수와 크릭을 중심으로 곳곳에 워터 해저드가 배치된 수려한 경관과 전략적 난이도가 조화된 코스입니다. 
넓은 페어웨이 덕분에 초보자도 편안히 즐길 수 있지만, 세컨드 샷에서의 거리 조절과 워터 해저드 회피 능력이 점수 차이를 만들어냅니다. 특히, 전·후반 마지막 홀에서는 호수를 끼고 감싸며 흘러가는 페어웨이와 그린 공략이 라운드를 마무리하는 중요한 키로 작용합니다. 워터사이드 코스는 단순한 라운드 장소를 넘어, 골프 자체의 즐거움과 시각적, 감각적 아름다움을 만끽하고, 서비스 수준까지 완벽하게 조화를 이루는 “태국 프리미엄 골프 경험”의 상징입니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '2500', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Plutaluang Navy Golf Course', '뿌딸루앙 네이비 골프코스', 'TH', 'UTP', 36, 'Moo 6, Plu Ta Luang, Sattahip District, Chonburi 20180, Thailand', '66800033811', 'https://www.facebook.com/p/Plutaluang-Navy-Golf-Course-100043003370911/', 6, 'Y', NULL, 'Royal Thai Navy', 'N', 1, 'N', '조이시아', '티프이글 버뮤다.', 100, 'https://maps.app.goo.gl/EXDNLqdvTjbQkVZt5', '1969년에 조성된 36홀 규모의 파크랜드 코스로 수풀이 울창한 계곡과 거대한 자연 호수를 중심으로 펼쳐져 있어 골프라기보다 자연 속 트레킹 느낌을 불러일으킵니다. 
좁은 그린과 빡빡한 러프, 전략적으로 배치된 벙커들이 있어 코스 공략에 어려움을 제공하며, 특히 북 코스의 3번 홀  아일랜드 그린에는 등대가 있어 시각적으로도 인상적이고, 남 코스 마지막 홀은 고저차가 있는 위치에서 물을 넘겨야 하는 숏게임이 요구되는 난코스로 유명합니다. 시설이 다소 노후화되고 코스 관리에도 미흡함이 있지만, 아름다운 경관과 합리적인 가격으로 만족도가 높습니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '300', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Wangjuntr Golf Park', '왕짠 골프 파크', 'TH', 'UTP', 54, '137 Moo 1, Pa Yup Nai, Wang Chan District, Rayong 21210, Thailand', '66819326669', 'http://www.wangjuntrgolf.com/', 5, 'Y', NULL, 'Prasobchai Kasemsant', 'H', 2, 'N', NULL, NULL, 110, 'https://maps.app.goo.gl/GvmPDhtVjULZU6Rm8', '54홀 규모의 챔피언십급 골프단지로, 밸리 코스, 하이랜드 코스, 정글 코스 세 개의 18홀 코스로 구성되어 있어 다양한 스타일의 플레이를 즐길 수 있습니다. 밸리 코스는 구릉 지형의 그린과 절벽 위 17번 홀 같은 도전적인 레이아웃이 특징이고, 하이랜드 코스는 전장이 7,600야드에 이르며, 고지대의 시야와 복잡한 페어웨이로 숙련된 골퍼에게 강한 인상을 줍니다. 정글 코스는 세 코스 중 가장 최근에 완성된 코스로, 울창한 수풀과 야자수, 꽃 등 동남아 자연의 정수를 느낄 수 있는 서정적인 설계가 돋보입니다. 왕짠 골프 파크는 자연림, 언덕, 계곡을 최대한 살린 환경친화적 골프 리조트로 태국 내 가장 독창적인 골프 리조트로 유명한 코스입니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '1000', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Empire Golf Club (The Emerald Golf Club)', '엠파이어 골프 클럽(에메랄드 골프 클럽)', 'TH', 'UTP', 18, '81 Moo 6, Ban Chang District, Rayong 21130, Thailand', '6638941111', 'https://www.facebook.com/p/The-Emerald-Golf-Club-2020-100057126683275/', 5, 'Y', NULL, 'Nick Faldo & Desmond Muirhead', 'N', 1, 'N', NULL, NULL, 105, 'https://maps.app.goo.gl/Xh7wQVDCCHwqoVm68', '숲과 산악 지대에 숨어 있는 엠파이어 골프 클럽은 세계적인 골퍼 닉 팔도와 데즈먼드 뮤어헤드가 설계한 18홀 파 72 챔피언십 코스로, 좁고 울퉁불퉁한 페어웨이와 전략적인 벙커 배치가 특징인 도전적인 레이아웃을 자랑합니다. 전반부는 비교적 수월하게 느껴지지만, 후반부로 갈수록 경사가 심해지고 난이도가 상승해 체력과 집중력을 시험하는 코스로 평가됩니다. 잔잔한 자연 속에서 도전적인 플레이 경험을 원하는 골퍼에게 특히 추천할 만한 파타야 골프에서 숨은 명소로 꼽힙니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '200', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Chatrium Golf Resort Soi Dao Chanthaburi', '차트리움 골프 리조트 소이 다오 찬타부리', 'TH', 'UTP', 18, '224 Moo 2, Tambon Tubsai, Amphoe Pong Nam Ron, Chanthaburi 22140, Thailand', '66899343008', 'https://www.chatrium.com/golfsoidaochanthaburi', 4, 'Y', NULL, 'Dennis Griffiths / Pirapon Namatra', 'N', 3, 'N', '조이시아', '챔피언 울트라 드워프 버뮤다', 210, 'https://maps.app.goo.gl/rTkT69XTggtDj4p69', '1995년 개장한 챔피언십 18홀, 파 72 코스로, 세계적인 골프 코스 디자이너 Denis Griffiths가 설계했으며 이후 태국의 유명 설계가 Pirapon Namatra가 일부 홀을 재설계해 코스를 더욱 정교하게 다듬었습니다. 해발 고도와 주변 산악 지형을 활용한 코스는 자연 그 자체를 존중하는 듯한 언듈레이션과 울창한 숲, 시원한 산자락 경관을 제공하며 “대자연 속에서의 골프”를 선사합니다. 리조트는 1,580에이커에 달하는 울창한 열대 정원과 구릉지에 둘러싸인 넓은 부지 내에 자리하며, 온수풀, 레스토랑, 마사지와 스파, 드라이빙 레인지 등의 부대시설을 제공하여 골프 이상의 휴식도 함께 경험할 수 있는 리조트입니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '500', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('331 Golf Club', '331 골프 클럽', 'TH', 'UTP', 18, '89/3 Moo 3, Hua Samrong, Plaeng Yao District, Chachoengsao 24190, Thailand', '66819295879', 'https://www.facebook.com/331GolfClubs', 6, 'Y', NULL, NULL, 'N', 2, 'N', NULL, NULL, 70, 'https://maps.app.goo.gl/SrcKjXyKbqkDaKpSA', '도로 번호 331번 인근에 위치해 이름이 붙었으며, 교통이 편리해 방콕·파타야 양쪽에서 접근이 가능합니다. 코스는 18홀 파 72, 총 전장 약 6,928야드로 비교적 넓은 페어웨이와 완만한 언듈레이션이 특징입니다. 전반적으로 초보자도 무난히 즐길 수 있는 구조지만, 곳곳에 전략적으로 배치된 벙커와 워터 해저드가 있어 상급자에게도 충분히 도전적인 요소를 제공합니다. 특히 바람의 영향을 받는 오픈형 홀이 많아 클럽 선택과 샷 컨트롤이 중요합니다. 그린은 속도가 중간 정도로 빠르며, 롤이 일정해 퍼팅 감을 맞추기 좋습니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '갤러리피 없음', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Pineapple Valley Golf Club Hua Hin', '파인애플 밸리 골프 클럽 후아힌', 'TH', 'HHQ', 18, '101 Moo 9, Tambol Thap Tai, Hua Hin, Prachuap Khiri Khan 77110, Thailand', '6632616200', 'https://pineapplevalleygolfclub.com/', 4, 'Y', NULL, 'Golf East (Pirapon Namatra)', 'H', 2, 'N', '조이시아', '티프이글', 30, 'https://maps.app.goo.gl/CKrEA5wQ4WRZ2sCy5', '2009년에 개장한 파인애플 밸리 골프 클럽은 과거 파인애플 농장을 활용해 설계된 18홀, 파 72 챔피언십 코스로, 설계자 피라폰 나마트라가 자연 지형을 최대한 살린 전략적 레이아웃을 구현했습니다. 개장 이후 아시아 태평양 최고 골프 클럽, Rolex 선정 Top 1,000 코스, 그리고 2023년 골프아시안 투표로 태국 최고의 골프 클럽에 선정되는 등 뛰어난 명성을 쌓아왔습니다. 코스는 언덕 위에 자리한 티 박스와 빠른 그린, 전략적으로 배치된 벙커와 워터 해저드로 모든 수준의 골퍼에게 도전을 제공합니다. 특히 15번 파3 홀은 바다와 시산토 섬이 내려다보이는 뛰어난 전망으로 ‘시그니처 홀’로 꼽히며, 연못과 그림 같은 경관이 함께 어우러지는 명소입니다');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '750바트(+ only 카트) / 1,150바트(카트+캐디)', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Black Mountain Golf Club', '블랙 마운틴 골프클럽', 'TH', 'HHQ', 18, '565 Moo 7, Nong Hieng Road, Hin Lek Fai, Hua Hin District, Prachuap Khiri Khan 77110, Thailand', '6632618666', 'https://blackmountainhuahin.com/', 4, 'Y', NULL, 'Phil Ryan', 'H', 3, 'N', '파스팔럼', '티프이글 버뮤다', 25, 'https://maps.app.goo.gl/s6pR4GsMHWjZzhSV8', '후아힌의 아름다운 계곡에 위치한 27홀 챔피언십 코스로, Phil Ryan이 설계한 3개의 9홀 코스(이스트, 노스, 웨스트)가 자연의 지형에 조화롭게 녹아든 전략적 레이아웃을 자랑합니다. 2007년 개장 이후 태국 최고의 골프장으로 여겨지며, Golf Digest의 ‘미국 외 베스트 100 코스’에 포함되고 여러 아시안투어 및 유럽투어 대회를 유치한 명실상부한 명문 코스로 자리잡았습니다. 아름다운 자연 배경, 검은 화강암 산과 울창한 숲, 개울과 벙커가 어우러진 코스는 ’리스크와 보상의 균형’을 체험할 수 있는 멋진 환경을 제공합니다. 27홀 모두 프로 수준의 그린과 페어웨이 상태를 유지하며, 여러 티박스로 구성되어 모든 수준의 골퍼에게 도전적이면서도 쾌적한 플레이 경험을 제공합니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '갤러리피 없음', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Lake View Resort & Golf Club', '레이크 뷰 리조트 앤 골프 클럽', 'TH', 'HHQ', 36, '80 Moo 4, Hubkrapong-Pranburi Highway, Cha Am, Phetchaburi 76120, Thailand', '6632709100', 'https://www.facebook.com/lakeviewgolfandyachtclub/?locale=th_TH', 5, 'Y', NULL, 'Roger Packard', 'N', 2, 'N', '파스팔럼', '티프이글 버뮤다', 20, 'https://maps.app.goo.gl/ywoL4J6uqejBBwzcA', '35km² 규모의 파크랜드 스타일 리조트형 골프 코스로, 36홀, 4개 코스(마운틴, 레이크, 데저트, 링크스 스타일)로 구성되어 다양한 플레이 경험을 제공합니다. 각 코스는 설계자가 다르며, 마운틴 코스의 굴곡진 페어웨이와 블라인드 샷, 레이크 코스의 연못과 전통적인 벙커 구조, 데저트 코스의 선인장 및 바위 지형, 그리고 링크스 코스의 개방적인 공간감과 전략적 거리 운용이 특징입니다. 특히 14번 파 3 홀은 작은 섬 티박스에서 시작해 또 다른 섬 그린을 향해 210야드를 보내야 하는 명물 홀로, 매우 도전적인 클라이맥스를 제공합니다. “가성비가 뛰어난 코스”로도 꼽히며, 평탄하면서도 전략적 디자인 덕분에 초중급자부터 상급자까지 모두 만족할 만한 균형 잡힌 플레이 환경을 제공합니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '없음 / 카트 동승 가능 / 800바트(Only 카트, 갤러리가 운전)', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Palm Hills Golf Club And Residence', '팜 힐즈 골프 클럽 앤 레지던스', 'TH', 'HHQ', 18, '1444 Petchkasem Road, Cha-am Sub-District, Cha-am District, Phetchaburi 76120, Thailand', '663527 777', 'https://www.palmhills-golf.com/', 5, 'Y', NULL, 'Max Wexler', 'N', 2, 'N', '버뮤다', '티프이글 버뮤다', 5, 'https://maps.app.goo.gl/1V7Mr3etwS2dy91F8', '1992년 개장한 후아힌 최초의 국제 기준 챔피언십 골프 코스로 넓고 구릉진 페어웨이, 빠른 그린, 전략적인 벙커와 워터 해저드를 통해 다양한 난이도를 제공합니다. 코스는 동서 방향으로 펼쳐져 있으며, 클럽하우스를 사이에 두고 양끝에 호수와 돌출된 바위 지형이 어우러져 고급스러운 경관미를 자랑합니다. 링크스 스타일이 가미된 구릉지 코스 디자인은 후아힌의 다른 골프장과 차별화된 정취를 선사하며, 전반적으로 평탄해 누구나 편안히 플레이할 수 있으나, 매우 빠른 그린과 암벽 기반의 페어웨이 경사는 퍼팅 난이도를 높여 전략적 플레이를 요구합니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '갤러리피 없음', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Royal Hua Hin Golf Club', '로얄 후아힌 골프 클럽', 'TH', 'HHQ', 18, 'Damnoen Kasam Alley, Hua Hin, Hua Hin District, Prachuap Khiri Khan 77110, Thailand', '6632512475', 'https://www.royalhuahingolfcourse.com/', 5, 'Y', NULL, 'A.O. Robins', 'N', 3, 'N', '파스팔럼', '티프이글', 11, 'https://maps.app.goo.gl/4sbiBun7xWXEQCTE8', '1924년 개장한 태국 최초의 국제 기준 골프장으로, 스코틀랜드 철도 엔지니어 A.O. Robins가 설계하며 태국 골프의 역사를 열었습니다. 주변 언덕과 석회암 절벽 사이에 조성된 전통적인 파크랜드 스타일 레이아웃이 특징입니다. 나무가 울창한 좁은 페어웨이, 도그레그 홀, 그리고 약간 높여진 작지만 길들여진 그린 등 클래식한 디자인 요소들을 보존하고 있어 플레이어에게 고전 골프의 맛을 전해줍니다. 코스 한편에는 100년이 넘는 역사를 배경으로 한 초기 클럽하우스가 자리하고 있으며, 전통적인 클래식 골프 경험을 원하는 골퍼와 역사적 가치를 느끼고 싶은 방문객에게 추천할 만한, “태국 골프의 살아있는 유산”입니다');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '350바트 / 카트 동승 가능 / 950바트(Only 카트, 갤러리가 운전) / 1,300바트(카트+캐디)', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Seapine Golf Course', '씨파인 골프 코스', 'TH', 'HHQ', 18, 'Seapine Golf Course Nong Kae Hua Hin District, Prachuap Khiri Khan 77110', '6632655988-89', 'https://www.seapine.co.th/golf-course/', 5, 'Y', NULL, 'Major General Weerayudth Phetbuasak', 'N', 2, 'N', NULL, NULL, 26, 'https://maps.app.goo.gl/AxmJTuSArfzBe8ATA', '2010년 개장한 18홀, 파 72 링크스 스타일 코스로, 해변 바로 곁에 자리하고 있습니다. 일부 홀이 기찻길을 경계로 바닷가와 산악 지형으로 나뉘어 배치되어 있어, 링크스 특유의 전략적인 샷 메이킹이 요구됩니다. 특히 12번 파 5 홀과 16번, 17번, 18번홀은 바다를 배경으로 한 도그레그, 워터 해저드, 좁은 페어웨이 구성으로 골퍼에게 인상적인 도전과 시각적 아름다움을 동시에 제공합니다. 코스는 평탄하지만 전반적으로 전략적 요소, 바람, 물, 벙커가 많아 핸디캡이 낮은 골퍼부터 상급자까지 모두에게 흥미롭고 다채로운 플레이를 선사합니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '500', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Springfield Royal country_code Club', '스프링필드 로얄 컨트리 클럽', 'TH', 'HHQ', 27, '208 Moo 2, Sampraya, Cha-am, Phetchaburi 76210, Thailand', '6632709256', 'https://www.springfieldresort.com/golf/contactus', 4, 'Y', NULL, 'Jack Nicklaus', 'H', 2, 'N', NULL, NULL, 23, 'https://maps.app.goo.gl/h5meYWU3kRk6YsCh8', '1993년 세계적 골프 레전드 잭 니클라우스가 처음 설계하고 2005년에 리-슈미트 & 브라이언 커리 팀이 추가 9홀을 완성한 27홀 챔피언십 파크랜드 코스로, 마운틴·레이크·밸리 3개 코스로 구성되어 골퍼에게 다양한 자연 경관과 전략적 난이도를 제공합니다. 호수와 벙커, 고저차를 활용한 구성이 특징이며, 특히 레이크 코스의 18번 홀은 아일랜드 그린과 도그레그 형태로 설계되어 롱히터에게 도전을, 시각적 임팩트를 제공하는 시그니처 홀로 손꼽힙니다. 태국 오픈 등 주요 토너먼트가 개최된 이력 덕분에 코스의 전략성과 유지 관리 수준은 매우 높은 평가를 받으며, 다양한 티 박스를 갖추어 초보부터 프로까지 모든 수준의 플레이어가 즐길 수 있습니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '500', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('The Majestic Creek country_code Club', '마제스틱 크릭 컨트리 클럽', 'TH', 'HHQ', 27, '164 Moo 4, Hua Hin, Prachuap Khiri Khan 77110, Thailand', '6632510672', 'https://www.majesticcreekcc.com/', 5, 'Y', NULL, 'Dr. Sukitti Klangvisai', 'N', 2, 'N', '파스팔럼', '티프이글 버뮤다', 38, 'https://maps.app.goo.gl/Fpzhfam1RMJUzsuaA', '후아힌 서쪽 구릉지대에 위치한 27홀, 파 72 챔피언십 골프 코스로, 고유 테마를 지닌 크릭, 레이크, 워터폴 코스 3개 구간으로 구성되어 있으며, 흐르는 물과 연못, 계곡을 넘거나 우회하는 샷 설계가 전략성을 한층 높입니다. 험난한 물을 넘는 티샷과 벙커, 구릉을 활용한 샷 컨트롤을 요구하는 홀이 많습니다. 마제스틱 크릭은 주변 농지와 산, 계곡 풍경이 한데 어우러지는 자연 경관 덕분에, ‘자연과 조화된 도전적인 디자인’이라는 평을 받으며 Hua Hin 최고의 코스 중 하나로 꼽히고 있습니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '갤러리피 없음', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Evergreen Hills Golf Club & Resort', '에버그린 힐스 골프 클럽 앤 리조트', 'TH', 'CAB', 18, '106 Moo 4,Tambol Wangdong, Amphur Muang, Kanchanaburi 71190, Thailand', '66895505869', 'https://evergreenhillsgolfclub.com/ko/', 6, 'Y', NULL, 'At-anan Yochinda', 'N', 2, 'N', NULL, NULL, 3, 'https://maps.app.goo.gl/CjuZd9bEJVKnJTJA9', '칸차나부리의 울창한 고지 계곡에 자리한 18홀 파 72 파크랜드 코스로 1994년 개장하였습니다. 울창한 숲과 다양한 나무가 페어웨이를 에워싸며, 좁은 페어웨이와 경사진 그린, 전략적으로 배치된 벙커가 정확한 샷을 요구합니다. 특히 16번과 17번 홀은 아일랜드 그린과 워터 해저드를 포함한 난이도 높아서 집중력과 샷의 정밀도를 시험받는 시그니처 홀입니다. 조용하고 고요한 자연 속에서 정확한 플레이에 중점을 두는 골프 경험을 선호하는 골퍼에게 특히 적합한 골프 코스입니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '200바트 / 동승 가능 / 1인 1카트 이용시 600바트', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Blue Sapphire Golf And Resort', '블루 사파이어 골프 앤 리조트', 'TH', 'CAB', 36, '85 Moo 13, Tambon Chongdan, Bo Phloi District, Kanchanaburi 71160, Thailand', '6634581565', 'https://www.facebook.com/BlueSapphiregolf/', 5, 'Y', NULL, 'Steven Youdan & Art-anan Yomchinda', 'N', 1, 'N', NULL, NULL, 3, 'https://maps.app.goo.gl/v7o6hviya5Q5Qb2d8', '36홀 파크랜드 챔피언십 골프장으로, 원래 사파이어 채굴장이었던 지형을 활용해 조성되었습니다. 캐년 코스(A/B)와 오션 코스(C/D)로 나뉘며, 에메랄드빛 인공 호수와 구릉 지형이 함께 어우러져 수려한 자연 경관과 전략적 설계를 동시에 제공합니다. 캐니언 코스는 특히 내리막 파 3홀과 다양한 워터 해저드를 포함해 코스 전반에 물이 중요한 플레이 요소로 작용하며, 오션 코스는 협소한 착지 구역, 높이 조정 그린, 구로 분할된 레이아웃 등 더욱 도전적인 레이아웃을 갖추고 있습니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '갤러리피 없음', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Grand Prix Golf Club', '그랑프리 골프 클럽', 'TH', 'CAB', 18, '91 Moo 13, Chongdan, Bo Phloi District, Kanchanaburi 71160, Thailand', '66871554888', 'https://www.grandprixgolfclub.com/th/', 5, 'Y', NULL, 'Mr. Prayard Chinnaraj & Dr. Prachin Eamlumnow', 'N', 3, 'N', '티프웨이 419', '티프이글 버뮤다', 3, 'https://maps.app.goo.gl/VT51UQHRxSocxYw18', '2011년 개장한 18홀 파72 파크랜드 코스로, 코스 위로 널찍하게 펼쳐진 미얀마 산맥의 파노라마 뷰가 인상적입니다. 강이 코스를 가로지르며 일부 홀을 나누고 있어, 인공적인 수로가 아닌 리버 해저드로서 플레이 전략에 자연스러운 재미를 더합니다. 여러 홀이 분할 페어웨이 형식으로 구성되어 있어 다양한 선택을 통해 전략적 사고를 요구하며, 다단 그린은 퍼팅 난이도를 크게 높여 정확한 클럽 선택이 필수입니다. 특히 파 5 5번 홀은 약 557야드의 코스에서 가장 인상적인 시그니처 홀로, 자연 경관을 따른 페어웨이와 수면에 둘러싸인 높은 그린이 어우러져 도전과 만족을 동시에 제공합니다. 매년 12월 아시안투어 Q스쿨이 열리는 골프장으로도 유명합니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '500', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Mission Hills Golf Club Kanchanaburi', '미션힐스 골프 클럽 칸차나부리', 'TH', 'CAB', 18, '27/7 Moo7 Thambol Pang-thru Amphur Thamuang Kanchanaburi 71110,Thailand', '66818150704', 'https://www.facebook.com/missionhillskan/?locale=th_TH', 5, 'Y', NULL, 'Jack Nicklaus', 'N', 1, 'N', NULL, NULL, 170, 'https://maps.app.goo.gl/oB9DqZ65jHVU2xCRA', '1991년에 개장한 18홀, 파 72 규모의 챔피언십 파크랜드 코스로, 아름다운 코스 전경과 전략적 난이도를 동시에 자랑합니다. 경사와 야자수로 둘러싸인 페어웨이는 물과 모래 해저드, 그리고 니클라우스 특유의 와스트 벙커가 조화를 이루며 중~상급 골퍼에게 도전적인 라운드를 제공합니다. 특히 5번 홀에는 더블 페어웨이가 도입되어 다양한 전략적 접근이 가능하고, 파 5 8번과 파 4 17번의 아일랜드 그린은 코스의 전략성과 시각적 매력을 극대화합니다. 골프 레전드 잭 니클라우스의 설계 답계 눈을 즐겁게 하는 풍경과 함께 숙련된 스킬을 시험할 수 있는 명품 코스로 평가받고 있습니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '200', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Royal Ratchaburi Golf Club', '로얄 라차부리 골프 클럽', 'TH', 'CAB', 18, '144 Moo 5, Tambon Khao Raeng, Amphoe Mueang, Ratchaburi 70000, Thailand', '6632227031–2', 'http://www.royalratchaburigolfclub.com/', 5, 'Y', NULL, 'Artanan Yomchinda', 'N', 2, 'N', NULL, NULL, 140, 'https://maps.app.goo.gl/29zCtpyjge2B9i7J6', '1988년에 개장한 18홀 파 72 파크랜드 코스로 카오 창라우와 카오랑이라는 두 산의 능선을 따라 자연스럽게 배치된 페어웨이와 호수들 사이로 설계된 시원한 레이아웃이 특징입니다. 전반부의 넓은 페어웨이는 부담 없이 플레이할 수 있지만, 후반부의 언듈레이션이 강조된 그린과 깊은 협곡을 넘겨야 하는 짧은 파 3 홀들은 집중력과 정밀한 샷을 요구합니다. 등산로 같은 오르내림이 있는 언덕 지형과 야자수 울창한 주변 풍경은 시각적 아름다움을 더하며, 미얀마 산맥의 전경이 인상적인 배경을 제공합니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '갤러리피 없음', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Mountain Creek Golf Resort And Residence', '마운틴 크릭 골프 리조트 앤 레지던스', 'TH', 'CYY', 27, '99/9 Moo 12, Mittraphap Road, KM 91, Tambon Lat Bua Khao, Amphoe Sikhio, Nakhon Ratchasima 30340, Thailand', '66888853782', 'https://mountaincreekthailand.com/en/index.php', 5, 'N', NULL, 'Seve Ballesteros', 'N', 3, 'N', '버뮤다', '티프이글 버뮤다', 200, 'https://maps.app.goo.gl/VeV9ZnFHAkCkzxbc7', '세계적인 골프 레전드 세베 바레스테로스가 설계한 27홀, 파 72 챔피언십 코스로, Highlands, Creek, Valley 3개 코스로 나뉘어 각기 다른 지형 특성을 살린 레이아웃을 선보입니다. 태국의 명산, 카오야이의 자연미와 섬세한 전략 설계가 조화를 이루며, 울창한 정글과 산악 경관 속에서 힘과 정확성, 집중력을 동시에 요구하는 도전적인 플레이 경험을 제공합니다. 코스 곳곳에 전략적으로 배치된 해저드와 울퉁불퉁한 그린은 각 홀마다 긴장감과 재미를 높여줍니다. 자연 속에서 프리미엄 라운드를 원하는 골퍼에게 특히 추천할 만한 명소입니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '600', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Starry Valley Golf Club (구.마이 오존 골프 클럽 카오야이)', '스태리 벨리 골프 클럽 카오야이', 'TH', 'CYY', 18, '334 Moo 6, Tambon Wangsai, Amphoe Pak Chong, Nakhon Ratchasima 30130, Thailand', '66906784362', 'https://www.movenpickresortkhaoyai.com/health-and-wellness/my-ozone-golf-club-khao-yai/', 5, 'Y', NULL, 'Pacific Coast Design', 'N', 1, 'N', '파스팔럼', '티프이글 버뮤다', 160, 'https://maps.app.goo.gl/zyhRhPdFYAhUGXaz5', '18홀, 파 68의 파크랜드형 코스로, 카오야이 산악 지대에 자리한 리조트형 골프장입니다. 코스는 전장이 짧아 파 5홀이 단 두 개, 파 3홀이 다섯 개로 구성되어 있어 보다 여유롭고 쉬운 라운드를 원하는 휴양 골퍼에게 적합합니다. 넓은 페어웨이와 정갈한 잔디, 아름다운 꽃밭이 어우러진 코스 미관이 돋보이며, 특징적인 큰 벙커 및 개울 옆 수직 암벽 등은 사진 찍기 좋은 풍경을 제공합니다. 스태리 밸리 골프클럽은 자연과 조화를 이루는 정원 같은 코스 구성, 스트레스가 적은 라운딩, 그리고 리조트 수준의 편의 시설을 동시에 갖춘 카오야이 지역의 대표적인 골프장입니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '600바트(카트 동승 가능) / 1,650바트(단독 카트 및 캐디 / 캐디팁 제외)', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Khao Yai country_code Club', '카오야이 컨트리 클럽', 'TH', 'CYY', 18, '151 Moo 5, Mu Si, Amphoe Pak Chong, Nakhon Ratchasima 30450, Thailand', '66892256363', 'http://www.brc-kycgolf.com/en', 5, 'Y', NULL, 'Jack Nicklaus', 'N', 2, 'N', NULL, NULL, 150, 'https://maps.app.goo.gl/S2M1VxmtYhXzno479', '잭 니클라우스가 설계한 18홀, 파 72 파크랜드 코스로, 카오야이 국립공원 인근 울창한 계곡과 산악 사이에 자리한 자연 경관이 인상적인 골프 클럽입니다. 코스는 기복이 있는 페어웨이와 전략적으로 배치된 벙커로 구성되어 있어, 샷의 정확성을 요구하는 동시에 플레이의 재미를 더해줍니다. 잘 관리된 그린과 페어웨이 컨디션, 그리고 친절한 캐디 서비스로 고객만족도가 높아  그림 같은 풍경 속에서 여유롭게 플레이하고 싶은 골퍼에게 추천할 만한 코스입니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '400', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Kirimaya Golf Resort & Spa', '키리마야 골프 리조트 앤 스파', 'TH', 'CYY', 18, '1/3 Moo 6, Thanarat Road, Moo-Si, Pak Chong District, Nakhon Ratchasima 30130, Thailand', '6644426000', 'https://www.kirimaya.com', 5, 'Y', NULL, 'Jack Nicklaus', 'N', 1, 'N', '버뮤다', '티프드워프 버뮤다', 150, 'https://maps.app.goo.gl/VeBsAHoiGxntjKki8', '잭 니클라우스가 설계한 18홀 챔피언십 코스로 코스 전체가 카오야이 국립공원 가장자리에 펼쳐진 울창한 자연 풍경 속에 자리해 있습니다. 싱글 트랙 레이아웃으로 설계되어 마치 골퍼 혼자만의 공간에서 라운드를 즐기는 듯한 프라이빗한 경험을 선사하며, 언듈레이션이 있는 페어웨이와 전략적인 벙커, 물 해저드를 활용한 설계로 깊이 있는 플레이를 요구합니다. 리조트는 고급 객실, 텐트형 빌라, 스파, 레스토랑, 피트니스, 클럽하우스 시설이 완비되어 있어 라운드 외에도 휴식과 레저 모두를 충족시켜 줍니다. 평온한 대자연 속 럭셔리 체험, 전략적 골프 그리고 리조트 시설이 어우러져, 키리마야는 골프와 휴양을 함께 즐기려는 골퍼에게 특히 매력적인 곳입니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '1100', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Rancho Charnvee Resort And country_code', '란쵸찬비 리조트 앤 컨트리 클럽', 'TH', 'CYY', 18, '333/2 Moo 12, Khanongphra, Pak Chong, Nakhon Ratchasima 30450, Thailand', '6644756210', 'https://www.charnveeresortkhaoyai.com', 5, 'Y', NULL, 'Bob McFarland', 'N', 2, 'N', '버뮤다', '티프드워프 버뮤다', 160, 'https://maps.app.goo.gl/dQrgwS93tStVXwmt5', '2010년에 개장한 18홀, 파 72 챔피언십 코스로 넓은 페어웨이와 리조트 스타일의 설계를 자랑하며, 완만한 지형에 전략적으로 배치된 벙커와 워터 해저드가 있어 초보자부터 상급자까지 즐겁고 도전적인 라운드를 즐길 수 있습니다. 특히, 1번 홀은 큰 호수를 넘겨야 하는 티샷으로 시작하여 심리적 자극을 주며, 백코스는 평평하면서도 주변 산악 경관을 배경으로 펼쳐져 시각적 즐거움을 극대화합니다. 클럽하우스는 호숫가에 자리한 목가적인 분위기로, 편안한 레스토랑과 프로숍, 숙박과 스파를 포함한 리조트 시설이 잘 갖춰져 있어 라운드 후 휴식을 위한 이상적인 공간을 제공합니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '600', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Sir James country_code Club', '써 제임스 컨트리 클럽', 'TH', 'CYY', 18, '195 Moo 3, Mittraphap Road, Muaklek District, Saraburi 18180, Thailand', '6636343200', 'https://www.sirjamesresort.com', 5, 'Y', NULL, 'John W. Rogers, Scotland', 'N', 1, 'N', '조이시아', '일본 조이시아', 140, 'https://maps.app.goo.gl/gstUT5wQQpPxAkgu7', '1993년 스코틀랜드 출신의 John W. Rogers가 설계한 18홀 파 72 파크랜드 코스로, 카오야이 국립공원의 산자락과 정글이 어우러지는 풍경 속에 자리해 시각적 매력이 뛰어납니다. 전체 길이는 약 7,160야드로 구성되어 있으며, 코스 곳곳에 흐르는 개울, 폭포, 연못 등이 전략적 요소이자 정원 같은 미감을 선사합니다. 특히 파 3 15번 홀이 내리막 샷으로 물로 둘러싸인 그린을 공략하는 시그니처 홀입니다. 전체적으로 난이도가 과하지 않으면서도 물과 벙커, 도그레그 홀, 언듈레이션 등으로 균형 있는 도전을 제공해 모든 수준의 골퍼에게 만족스러운 경험을 제공합니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '600', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Toscana country_code Club', '토스카나 컨트리클럽', 'TH', 'CYY', 18, '96 Moo 9, Mu-Sri, Pak Chong, Nakhon Ratchasima 30130, Thailand', '66449830560', 'https://toscanavalley.com', 5, 'Y', NULL, 'Robert McFarland', 'H', 2, 'N', '버뮤다', '일본 조이시아', 190, 'https://maps.app.goo.gl/bYt13R42cAjsbpD79', '18홀 챔피언십 파크랜드 코스로, 2009년 개장 이래 깊은 계곡과 유서 깊은 카오야이 국립공원의 산악 배경 속에 자리 잡으며 이탈리아 토스카나의 감성과 풍경을 재현한 명품 코스로 평가받고 있습니다. 코스는 200야드를 넘는 대형 워터 캐리, 급격한 언듈레이션을 지닌 그린과 날카로운 페어웨이 낙차, 각 홀마다 전략적 구성을 자랑하는 설계로 난이도가 높아 초보자에게는 다소 부담이 될 수 있습니다. 그린과 페어웨이 유지 관리 상태가 뛰어나고, Italian 테마의 클럽하우스 및 주변 빌라들이 아름답게 어우러져, 티샷부터 퍼팅까지 시각적 즐거움이 가득한 환경을 제공합니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '1,500바트(카트,캐디 포함)', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Korat country_code Club Golf & Resort', '코랏 컨트리 클럽 골프 앤 리조트', 'TH', 'CYY', 18, 'Ratchasima–Pak Thong Chai Road, Tambon Thong Chai Nuea, Pak Thong Chai District, Nakhon Ratchasima 30150, Thailand', '6644300890', 'https://www.koratgolf.com/', 5, 'Y', NULL, 'Local Design', 'N', 1, 'N', NULL, NULL, 210, 'https://maps.app.goo.gl/UQc39sXdFfbh2SKi6', '1997년에 개장한 울창한 숲으로 둘러싸인 18홀 Woodland형 골프 코스로 야외 수영장을 갖춘 휴양형 리조트입니다. 블루 티(Blue Tees) 기준, 파4홀들이 도전적이면서도 전략적인 플레이를 즐길 수 있도록 설계되어 있어 초보자부터 숙련된 골퍼까지 모두 만족시킵니다. 그린이 작아 아이언 샷의 정확성이 중요하며, 다양한 핀 위치를 제공해 코스의 재미를 더 합니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '200', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Singha Park Khon Kaen Golf Club', '싱하 파크 콘깬 골프 클럽', 'TH', 'CYY', 18, '555 Moo 19, Tambon Taphra, Amphoe Mueang, Khon Kaen 40260, Thailand', '6643209000', 'http://www.singhapark-khonkaen.com/', 5, 'Y', NULL, 'Golf East', 'N', 3, 'N', '씨쇼어 파스팔럼', '노보텍 버뮤다', 32, 'https://maps.app.goo.gl/MLxT9m3CHP79gB3L7', '싱하 파크 콘캔 골프 클럽은 2009년 태국 콘캔 지방 타프라 지역에 개장한 18홀 파72 챔피언십 코스로, 총 7,502야드의 도전적인 레이아웃을 갖추고 있습니다. 이 코스는 싱하 맥주 공장의 폐수 처리장을 아름다운 골프 코스로 탈바꿈시켰는데, 16개의 홀에 호수가 전략적으로 배치된 독창적인 레이아웃이 특징이며, 정교한 샷과 심리적 전략이 요구되는 설계입니다. 2009년부터 2016년까지 아시안 투어의 킹스 컵(King’s Cup)을 개최하여 국제적 무대에서도 인정받았습니다. 태국 북동부 지역의 대표 골프장이라 할 수 있습니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '라운딩 요금의 100% 금액', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Panorama Golf And country_code Club', '파노라마 골프 앤 컨트리 클럽', 'TH', 'CYY', 18, '68 Moo 10, Nongyakhao, Sikhio, Nakhon Ratchasima 30140, Thailand', '66925855766', 'http://www.panoramacountry_codeclub.net', 5, 'Y', NULL, 'Dean Refram', 'N', 2, 'N', '버뮤다', '티프드워프 버뮤다', 185, 'https://maps.app.goo.gl/WQ2JQdHCM4THBpzZ9', '1993년에 개장한 18홀, 파 72 챔피언십 코스로 세계적인 설계가 딘 레프램이 디자인하였습니다. 이 코스는 카오야이 국립공원 인근의 계곡과 산악 지형을 고스란히 활용한 파크랜드 스타일 레이아웃으로, 자연의 고저차와 바람이 코스 난이도를 더합니다. 페어웨이는 자연 지형을 따라 구불거리고, 2번·4번·15번 홀에는 물이, 10번 홀에는 절벽과 블라인드 샷이 요구되는 전략적 요소들이 배치되어 있어 다양한 샷이 요구됩니다. 코스 상태는 연중 최고의 관리 수준을 유지하며, 빠르고 정교한 그린, 깔끔한 페어웨이와 벙커는 골퍼들에게 큰 만족을 줍니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Royal Hills Golf Resort & Spa', '로얄 힐스 골프 리조트 앤 스파', 'TH', 'CYY', 18, '100/3 Moo 2, Sarika-Nangrong Rd., Sarika, Mueang, Nakhon Nayok 26000, Thailand', '66373852105', 'https://www.royalhillsresort.com', 5, 'Y', NULL, 'Nelson & Wright', 'N', 1, 'N', NULL, NULL, 2, 'https://maps.app.goo.gl/3UbSPEp41Lgz3KaE8', '로얄힐스 골프 앤 컨트리 클럽은 유네스코 세계자연유산인 카오야이 국립공원 인근, 나콘나욕에 자리해 있어 그림 같은 산악 계곡 풍경과 깨끗한 공기를 동시에 즐길 수 있는 명소입니다. 이곳은 세계적 설계팀 벨트 콜린스가디자인한 18홀 파72 챔피언십 코스로, 넓은 페어웨이와 전략적으로 배치된 벙커 및 워터 해저드가 골퍼들에게 다양한 도전을 제공합니다. 방콕에서 차로 약 1–2시간 거리로 접근성도 뛰어나 도심을 벗어나 자연 속 여유로운 골프 여행을 계획하는 이들에게 이상적인 목적지입니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '200', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Kabin Buri Sport Club (The Longest in Thai)', '카빈부리 스포츠 클럽', 'TH', 'CYY', 18, '196 Moo 11, Suwannason Rd, Wang Dan, Kabin Buri, Prachin Buri 25110, Thailand', '66373852105', 'https://www.kbscgolf.com/', 4, 'Y', NULL, 'Mr. Yoshikazu Kato', 'N', 3, 'N', '파스팔럼', '티프드워프 버뮤다', 2, 'https://maps.app.goo.gl/aCiUm5MaX5iQcB7A9', '2007년에 설계된 18홀 파 72 구성에 챔피언십 티 기준 8,075야드로 태국에서 가장 긴 코스입니다. 설계는 블루 캐년으로 유명한 일본 건축가 요시카즈 카토가 맡았으며, 초보자부터 상급자까지 모두가 즐길 수 있도록 여러 티잉 구역을 제공하는 것이 큰 장점입니다. 전 홀에 걸쳐 수려한 워터 해저드와 전략적인 벙커, 그리고 바람과 정확한 샷이 요구되는 레이아웃이 구성되어 있어 플레이에 재미를 더합니다. 방콕에서 차로 약 160km 거리로 접근성도 뛰어나며, 자연과 스포츠가 조화된 골프 여행지로 추천드립니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '300', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Alpine Golf Resort Chiangmai', '알파인 골프 리조트 치앙마이', 'TH', 'CNX', 27, 'P.O. Box 16, San Kamphaeng–Banthi Rd., Chiang Mai 50130, Thailand', '6653880880', 'https://www.alpinegolfresort.com/', 5, 'N', NULL, 'Ron Garl, Golf East', 'L', 3, 'N', '조이시아', '티프이글', 35, 'https://maps.app.goo.gl/5SkPUepvwZQVvNpM8', '알파인 골프 리조트 치앙마이는 의심할 여지없이 치앙마이 최고의 골프장 중 하나입니다. 알파인은 2013년과 2014년 치앙마이 클래식 아시아 투어를 개최하며 세계적 수준의 레이아웃으로 더욱 인정을 받았습니다.
산으로 둘러싸인 아름다운 자연이 가득한 계곡을 사이에 두고 태국의 골프장답게 도전적면서도 독특한 레이아웃으로 자연에 가까운 골프 환경을 선호하는 골퍼들에게 안성맞춤입니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '600', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Summit Green Valley Chiangmai country_code Club', '섬밋 그린 밸리 치앙마이 컨트리 클럽', 'TH', 'CNX', 18, '186 Moo 1, Chotana Rd., Maesa, Maerim, Chiang Mai 50180, Thailand', '6653298222', 'https://www.summitgreenvalley.com/', 5, 'N', NULL, 'Denis Griffiths', 'L', 2, 'Y', '버뮤다', '티프드워프 버뮤다', 35, 'https://maps.app.goo.gl/v3yBEQraATYaRKdi9', '서밋 그린 밸리는 태국 북부 특유의 아름다운 주변 환경, 상쾌한 공기, 다양한 자연 경관을 제공합니다. 골프 코스에는 잘 배치된 모래 벙커가 많고, 야자수가 늘어선 페어웨이는 넓어 보이지만 워터해저드를 조심해야 합니다. 그린은 크고 어프로치 샷에 적합하며 퍼팅 속도는 보통에서 약간 빠릅니다. 코스의 길이, 고도 변화, 강한 바람으로 인해 파워보다는 정확성이 요구됩니다. 공항과 시내 중심가 근처의 편리한 위치로 인해 이 클럽은 치앙마이 도착 또는 출발 당일에 게임을 즐기고 싶은 사람들에게 적합합니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '플레이어와 요금 및 규정 동일', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Artitaya Chiang Mai Golf Resort', '아티타야 치앙마이 골프 앤 리조트', 'TH', 'CNX', 18, 'Lamphun, Mueang Chiang Mai District, Moo 9, Thailand', '6653888888', 'https://www.artitayagolf.com/', 5, 'Y', NULL, 'Seni Thirawat', 'N', 1, 'N', NULL, NULL, 60, 'https://maps.app.goo.gl/ERGMkzZfwSXGYp9g9', '치앙마이에서 약 50km 떨어진 람푼 지역의 전원 풍경 속에 자리한 18홀 파72 챔피언십 코스로, 넓은 필드와 과수원, 정글, 협곡이 어우러진 고요한 자연이 특징입니다. 2009년에 개장하여 2012년에 완성된 이 코스는 약 7,329야드에 달하는 도전적인 레이아웃과 완만한 언덕 지형 덕분에 편안한 보행과 도전적인 게임이 조화를 이룹니다. 페어웨이 중간이나 티 박스 바로 앞에 나무가 자라는 독특한 설계와 몇몇 홀의 워터 해저드를 넘겨야 하는 어프로치샷을  요구하여 색다른 재미를 제공합니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '500', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Chiangmai Highlands Golf And Spa Resort', '치앙마이 하이랜드 골프 앤 스파 리조트', 'TH', 'CNX', 27, '167 Moo 2, On Nua, Mae On, Chiang Mai 50130, Thailand', '6653261354', 'https://www.chiangmaihighlands.com/', 5, 'Y', NULL, 'Lee Schmidt, Schmidt Curley Design', 'H', 1, 'N', '파스팔럼', '티프이글', 45, 'https://maps.app.goo.gl/oNGFDP8ySLhrv79p9', '치앙마이 하이랜드 골프 앤 스파 리조트는 27홀의 웅장한 챔피언십 골프 코스가 특징으로 골퍼들에게 홀마다 웅장한 산악 경치의 시각적인 즐거움을 제공합니다. 개장 이후 매년 아시아 최고의 신규 코스, 태국 최고의 코스, 가격 대비 최고의 가치 등 아시아 10대 상을 수상해 왔습니다. 
하이랜드 코스 자체는 모든 레벨의 플레이어에게 흥미롭고 도전적이며 5개의 다양한 티박스를 선택할 수 있습니다. 그린은 기복이 있으나, 단단하면서도 수용력이 좋고, 아이언 샷을 잘 잡아냅니다. 해가 산 뒤로 지기 시작할 무렵 라운딩 중이라면 골퍼들이 왜 이것을 태국에서 가장 기억에 남는 골프 경험으로 여기는지 이해하게 될 것입니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '비수기 750바트 / 성수기 1600바트(현장 지불/성인,아동 동일)', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('The Royal Chiangmai Golf Resort', '더 로얄 치앙마이 골프 리조트', 'TH', 'CNX', 18, '169 Moo 5, Chiang Mai-Prao Rd., T. Maefak, A. Sansai, Chiang Mai 50290, Thailand', '6653849301', 'https://www.royalchiangmai.com/', 5, 'Y', NULL, 'Peter Thomson', 'N', 1, 'N', '조이시아', '티프드워프 버뮤다', 60, 'https://maps.app.goo.gl/eZ2UuRLsFKneUvnS8', '치앙마이의 북부 산지에 자리한 파 72, 7,200야드의 정교한 파크랜드 코스로, 브리티시 오픈 5회 챔피언 피터 톰슨의 설계로 자연과 조화를 이루는 링크스 스타일 요소가 돋보입니다. 울창한 나무와 폭포, 시냇물로 둘러싸인 코스는 전략적인 벙커, 울퉁불퉁한 페어웨이, 워터 헤저드 통해 정밀한 샷을 요구하고, 장타보다 정확성이 중요한 플레이 환경을 제공합니다. 특히 돋보이는 두 개의 시그니처 홀은, 4번 홀의 경사 구간과 5번 홀의 내리막 구조가 맞물린 변화무쌍한 난이도로 골퍼들에게 깊은 인상을 남깁니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '600', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Maejo Golf Club & Resort', '메조 골프 클럽 앤 리조트', 'TH', 'CNX', 18, '112 Moo 7, Ban Sriboonruang, Pahpai, Sansai, Chiang Mai 50210, Thailand', '6653354431', 'https://www.maejogolfclub.com/', 5, 'Y', NULL, 'Seni Thirawat', 'H', 1, 'N', '조이시아', '코리안 벨벳', 30, 'https://maps.app.goo.gl/Jg1VdhJ3iYxWWq288', '매조대학교에 위치한 매조 골프클럽은 나무가 늘어선 페어웨이를 이용한 전략적 설계로 골퍼들에게 매우 인기가 높습니다. 페어웨이나 잔디의 컨디션도 치앙마이의 상급수준의 골프장으로 잘 관리되었고, 넓은 페어웨이와 낮은 벙커로 플레이하는데에 큰 어려움이 없어 초급자부터 중급자까지 모두 함께 즐길수 있는 골프장입니다. 특유의 아름다운 조경과 높지않은 난이도로 초심자, 여성골퍼 분들에게 인기가 많아 연인 또는 부부동반 플레이를 원하시는 골퍼들에게 적합한 골프장입니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '600', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Gassan Legacy Golf Club', '가산 레거시 골프 클럽', 'TH', 'CNX', 18, '88 Moo 7, Ban Thi, Ban Thi, Lamphun 51180, Thailand', '6653921888', 'https://www.gassangolf.com/gassan-legacy/en', 5, 'Y', NULL, 'Schmidt-Curley (Lee Schmidt)', 'N', 2, 'N', '파스팔', '티프이글 버뮤다', 30, 'https://maps.app.goo.gl/szdLyP2o4mycP2KAA', '태국 북부 람푼 지역에 위치한, 치앙마이 중심부에서 차로 약 45분 정도 소요되는 규모 있는 골프 리조트입니다. 2014년 세계적인 코스 설계사 Schmidt‑Curley에 의해 전면 리노베이션된 18홀, 파 72 구성을 갖춘 챔피언십 코스로, 총 길이는 약 6,852야드입니다. 코스 곳곳에 워터 해저드가 자리하고 있으며, 특히 위험과 보상을 동시에 제공하는 전략적 설계가 돋보여 정확한 샷이 요구되는 골프 코스입니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '500', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Gassan Panorama Golf Club', '가산 파노라마 골프 클럽', 'TH', 'CNX', 18, '99 Moo 17, Makua Jae, Mueang, Lamphun 51000, Thailand', '6693213999', 'https://www.gassangolf.com/gassan-panorama/en', 5, 'Y', NULL, 'Gassan Construction', 'N', 2, 'N', '파스팔', '티프이글 버뮤다', 45, 'https://maps.app.goo.gl/yZiscRHwX3dJZvGz7', '2006년 11월에 개장한 이후 2017년 코스 리노벵션을 거쳐 현재의 이름으로 새롭게 탄생한, 가산 그룹의 세 번째 골프 코스입니다. 넓은 호수를 중심으로 18홀이 설계된 독특한 레이아웃이 특징이며,  워터 해저드와 벙커, 언덕, 산과 어우러진 풍경이 골프의 도전과 시각적 즐거움을 동시에 제공합니다. 특히 파 6홀(백티 기준 666야드)이 포함되어 있어 코스를 더욱 독특하게 만들며, 전략적 샷을 요구합니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '500', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Gassan Khuntan Golf & Resort', '가산 쿤탄 골프 앤 리조트', 'TH', 'CNX', 18, '222 Moo 3, Thanpladok, Maetha, Lamphun 51140, Thailand', '6653507006', 'https://www.gassangolf.com/gassan-khuntan/en', 5, 'Y', NULL, 'Mr. Pravit Reungpo', 'H', 2, 'N', '버뮤다', '티프드워프 버뮤다', 45, 'https://maps.app.goo.gl/wtnqskf3952nFaYA6', '산악 풍경을 배경으로 한 총 18홀, 파 72의 챔피언십 코스로, 약 7,062야드의 도전적인 레이아웃을 자랑합니다. 코스 전체는 강변과 깊이 있는 벙커, 도그레그, 아일랜드 그린 등의 다양한 전략적 장애물로 구성되어 숙련된 골퍼에게 높은 재미와 압박감을 선사합니다. 클럽하우스 외에도 수영장, 마사지, 피트니스, 레스토랑, 연회장 등 다양한 편의 시설을 갖추었으며, 친환경 캠핑·트레킹·산악자전거 등의 어드벤처 활동도 제공되어 골프 외 휴식과 액티비티를 병행할 수 있습니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '500', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('North Hill Golf Club Chiang Mai', '노스힐 골프 클럽 치앙마이', 'TH', 'CNX', 18, '333 Moo 13, Banwan A, Hang Dong, Chiang Mai 50230, Thailand', '6653908999', 'https://www.northhillchiangmai.com/', 5, 'Y', NULL, 'Local Thai Design', 'N', 2, 'Y', NULL, NULL, 20, 'https://maps.app.goo.gl/WSxzEXqYozQThwv86', '노스힐 골프 클럽은 2011년 9홀로 오픈, 2015년에 9홀을 추가로 오픈하여 18홀 정규코스로 재탄생 하였습니다. 꾸준한 리노베이션으로 항상 최상의 컨디션을 유지 하고 있는 골프장 이며, 5성급 수준의 부대 시설을 갖추고 있습니다. 페어웨이의 업다운이 심하지 않아 초심자들도 도전해볼만한 코스 입니다. North Hill의 가장 큰 매력은 훌륭한 골프 코스 유지 관리이며, 라운딩을 마친 후 미쉐린 스타에 걸맞는 클럽하우스 내 레스토랑을 이용해 보세요.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '500', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Happy city_code Golf & Resort (Chiang Rai)', '해피 시티 골프 & 리조트 (치앙라이)', 'TH', 'CNX', 27, '648/6 Uttarakit Road, Tambon Viang, Amphoe Mueang, Chiang Rai, Thailand', '66910762074', 'https://www.facebook.com/Happycity_codeGolfChiangrai/', 5, 'Y', NULL, 'Pongsak Daengchuang and Prasan Srisuphachaiya', 'N', 1, 'N', NULL, NULL, 200, 'https://maps.app.goo.gl/nQCNzrVT8J7mmFaQA', '치앙라이 산기슭에 위치한 코스로, 한국인이 소유하며 현지 골프 전문가들이 설계한 Lakeside, Mountain Breeze, River 등 세 개의 9홀 코스, 총 27홀로 이루어져 있습니다. 각 코스는 워터 해저드와 전략적 벙커 배열이 돋보이는 Lakeside, 장타자를 유혹하는 널찍한 페어웨이의 Mountain Breeze, 그리고 강과 산을 배경으로 도전적인 코스 설계를 갖춘 River로 구성되어 골퍼들에게 다양한 난이도와 풍경을 제공합니다. 2012년 개장 이후 2013년 조경 보강과 2014년 버뮤다 잔디 채택 등의 지속적인 시설 개선을 통해 우수한 코스 품질을 유지하고 있습니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '500', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Santiburi Chiang Rai country_code Club', '산티부리 치앙라이 컨트리 클럽', 'TH', 'CNX', 18, '160 Moo 14, Sanambin Road, Robwiang, Muang, Chiang Rai 57000, Thailand', '6653756442', 'http://www.santiburi.com/chiangrai/course.html', 5, 'N', NULL, 'Robert Trent Jones Jr.', 'N', 3, 'N', '티프웨이 419', '티프드워프 버뮤다', 230, 'https://maps.app.goo.gl/PcUi4hF9dR67uTD37', '치앙라이의 구릉지에 자리한 18홀 파 72 챔피언십 코스로, Robert Trent Jones Jr.의 설계로 1992년에 개장한, 싱하그룹이 운영하는 지역 내 최고 수준의 골프장입니다. 기복이 뚜렷한 페어웨이와 빠르게 유지되는 그린, 풍부한 워터 해저드 및 벙커가 전략적 설계를 통해 모든 수준의 골퍼에게 도전과 재미를 제공합니다. 전반부 9홀은 완만한 구릉을 따라 리듬감 있게 이어지며, 후반부 9홀은 계곡과 호수를 가로지르며 더욱 변화를 주어 말 그대로 극적인 마무리를 선사합니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '500', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Waterford Valley Golf Club (Chiang Rai)', '워터포드 밸리 골프 클럽 (치앙라이)', 'TH', 'CNX', 18, '222 Village No.5, Pasang Sub-district, Wiang Chiang Rung District, Chiang Rai 57210, Thailand', '6653953440', 'waterfordgolfcourse.com', 5, 'Y', NULL, 'Rathert International Golf Design', 'N', 2, 'N', NULL, NULL, 225, 'https://maps.app.goo.gl/EuJ7opQZWgb27ycq7', '치앙라이 시내에서 차로 약 40분 거리에 위치한 고원 지대의 18홀 파 72 챔피언십 코스로, 천혜의 자연 경관과 쾌적한 기후가 돋보입니다. 코스는 거의 평탄한 구릉 지형으로 구성되어 있지만, 일부 홀에서는 급격한 고저차가 있어 클럽 선택에 신중함이 요구되는 설계입니다. 특히 9번 홀은 워터 해저드를 넘어 그린으로 이어지는 다이나믹한 레이아웃으로 많은 골퍼들에게 도전과 재미를 선사합니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '300', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Aquella Golf & country_code Club', '아쿠엘라 골프 앤 컨트리 클럽', 'TH', 'HKT', 18, '157/12 Moo 9, Limdul Road, Thai Mueang District, Phang-nga 82120, Thailand', '6676679308', 'https://www.aquellagolf.com/', 4, 'Y', NULL, 'Pacific Coast Design', 'N', 2, 'N', '파스팔럼', '티프드워프 버뮤다', 70, 'https://maps.app.goo.gl/FsBFeMJvjujjgTin9', '태국 팡응아 지역 안다만 해안가에 위치한 18홀 파 72 챔피언십 골프 코스로 호텔, 풀빌라, 마리나, 비치 클럽을 갖춘 독보적인 라이프스타일 공간입니다. 코스는 7,019야드의 넓고 완만하며, 전략적으로 배치된 벙커, 물길, 나무군락, 그리고 코스 전반에 파스팔럼 플래티넘 잔디를 통해 연중 뛰어난 상태의 플레이 경험을 제공합니다. 특히 시그니처 홀인 11번 홀은 안다만 해의 투명한 바다와 하얀 해변을 배경으로 한 파 3 코스로, 시각적 아름다움과 함께 난이도까지 겸비한 인상적인 경험을 선사합니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '800', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Hula Hula Golf Club', '훌라 훌라 골프 클럽 (끄라비)', 'TH', 'HKT', 18, '339 Moo 12, Petchakasem Road, Krabi Noi, Mueang Krabi, Krabi 81000', '66919988891', 'https://www.hulahulagolfclub.com/', 5, 'Y', NULL, 'Local Thai Design', 'H', 1, 'N', NULL, NULL, 160, 'https://maps.app.goo.gl/AWPhSkVMuTP98r3PA', '크라비 공항 인근에 위치한 9홀 파 36 (3,011야드) 규모의 코스로 넓은 호수와 야자수, 코코넛 나무가 어우러진 열대 풍경 속에 설계되어 있으며, 평탄한 지형 위에 전략적으로 배치된 벙커들이 편안하면서도 도전적인 플레이를 선사합니다. 특히 라운드 중에는 인근 크라비 공항에서 비행기가 이착륙하는 장면과 타이거 동굴 사원의 전망을 함께 즐길 수 있어 독특한 매력을 더합니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '800', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Kirinara Golf Course', '키리나라 골프 코스', 'TH', 'HKT', 9, '20/9 Moo 4, Bang Sai, Takuapa, Phang Nga, Thailand 82110', '66936144759', 'https://www.kirinara.com/about', 5, 'Y', NULL, 'Japanese Design', 'H', 1, 'N', NULL, NULL, 90, 'https://maps.app.goo.gl/jPJGzDfmWW7hPa1z6', '푸켓 공항에서 1시간 30분 거리의 산간 지역에 자리한 아름다운 자연 속 9홀 파36 코스로, 산에서 흘러내리는 맑은 개천이 코스를 자연스럽게 가로지르며 워터 해저드의 역할을 하여, 각 홀에 자연과 조화를 이루는 전략적 요소를 제공하고 휴식 같은 라운드를 만들어냅니다. 다소 완만한 구릉 지형 위에 팜트리와 벙커, 다양한 거리의 홀들이 적절히 배치되어 있어 골퍼의 기술 수준에 따라 다양한 도전과 재미를 느낄 수 있습니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '200', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Blue Canyon country_code Club (Canyon Course)', '블루 캐년 컨트리 클럽 (캐년 코스)', 'TH', 'HKT', 18, '165 moo 1 Thepkassatri Road Thalang Phuket 83140, Thailand', '66076328088', 'https://www.bluecanyonphuket.com/#section-02', 4, 'Y', NULL, 'Yoshikazu Kato', 'L', 3, 'N', '조이시아', '티프이글', 10, 'https://maps.app.goo.gl/i3WDBQHAVd5xp9dQ6', '1991년에 설계된 요시카즈 카토의 작품으로, 원래 폐광지와 고무 농장이라는 자연 지형을 최대한 보존하며 만들어진 아시아 최고 수준의 챔피언십 코스입니다. 총 18홀, 파 72, 블랙티 기준 약 7,244야드에 이르는 긴 전장으로 설계되어 있으며, 협곡과 울창한 수림, 자연 해저드를 활용한 좁고 도전적인 페어웨이가 특징입니다. 특히 티샷이 협곡을 가로질러야 하는 13번 홀과, 깊은 수로를 끼고 내리치는 파 3인 14번 홀이 대표적인 시그니처홀로 꼽힙니다. 이외에도 프레드 커플스가 “세계에서 가장 뛰어난 파 3 중 하나”라고 칭한 17번 홀은 내리막 그린과 빠른 잔디 경사로 인해 정밀한 샷을 요구합니다. 자연환경과 전략적 설계가 어우러진 캐년 코스는 골프 그 이상의 감동을 전달하는, 진정한 명문 코스로 손꼽히고 있습니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '1,050바트(카트+캐디 포함)', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Blue Canyon country_code Club (Lake Course)', '블루 캐년 컨트리 클럽 (레이크 코스)', 'TH', 'HKT', 18, '165 moo 1 Thepkassatri Road Thalang Phuket 83140, Thailand', '66076328088', 'https://www.bluecanyonphuket.com/#section-02', 4, 'Y', NULL, 'Yoshikazu Kato', 'N', 3, 'N', '조이시아', '티프이글', 10, 'https://maps.app.goo.gl/i3WDBQHAVd5xp9dQ6', '1999년 요시카즈 카토가 설계한 18홀 파 72 챔피언십 코스로, 블랙 티 기준 7,129야드에 이르는 인상적인 전장을 자랑합니다. 전체 코스의 17개 홀이 수계 및 자연 협곡 위에 배치되어 있어, 전략적 플레이를 필요로 합니다. 전반부 9홀은 호수와 자연적인 협곡 사이를 누비며 진행되고, 후반부는 고무나무 숲과 경쾌한 호수를 배경으로 펼쳐지는 다이나믹한 전개가 돋보입니다. 특히 18번 홀은 “아시아 최고의 파 4 홀 중 하나”로 평가되며, 협곡을 넘어 그린에 도달하기 위해서는 정확하고 전략적인 샷이 필요합니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '1500(카트+캐디피+캐디팁 포함)', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Katathong Golf Resort & Spa', '카타통 골프 리조트 & 스파', 'TH', 'HKT', 18, '51 Moo 4 Thung Kha Ngok District Mueang, Phangnga, Thailand 82000', '66611738338', 'https://www.katathong.com/', 5, 'Y', NULL, 'Local Thai Designer', 'N', 3, 'N', '조이시아', '노보텍 버뮤다', 75, 'https://maps.app.goo.gl/i2XAgACtj1x6jRDv7', '태국 팡응아 주“꿈의 골짜기”에 위치한 18홀 챔피언십 골프 코스로, 원래 주석 광산 지역을 자연 그대로 살린 채 설계되어 열대 우림과 산, 물을 배경으로 하는 독특한 풍광을 자랑합니다. 총 길이 약 7,023야드(블루 티 기준)에 이르며, 물을 넘기는 티샷이 필요한 시그니처 10번 홀과 숨은 그린이 도전적인 17, 18번 홀 등 전략적 재미가 풍부합니다. 푸켓 국제공항에서 차로 약 한 시간 거리에 위치해 있어 골프와 휴양을 결합한 여행지로 매우 적합하며, 뛰어난 자연미와 수준 높은 시설이 조화를 이루는 골프 리조트입니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '500', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Laguna Golf Phuket', '라구나 골프 푸켓', 'TH', 'HKT', 18, '34 Moo 4, Srisoonthorn Rd., Cherng Talay, Thalang, Phuket 83110', '6676324350', 'https://www.lagunagolfphuket.com/', 4, 'Y', NULL, 'Paul Jansen', 'L', 2, 'N', '조이시아', '자포니카 조이시아', 30, 'https://maps.app.goo.gl/5L2Ghj3mJxU6G5Xp8', '18홀, 파 71 챔피언십 코스로 6,756야드의 전장과 완만한 언듈레이션 페어웨이, 그리고 아름다운 호수와 맑은 하늘이 어우러져 시각적 매력과 전략적 난이도를 동시에 제공합니다. 2014년 코스 리노베이션을 통해 전략적 클럽 선택과 정교한 샷이 요구되는 레이아웃으로 개선되었으며, 특히 14번 업힐 파 5, 17번 도그레그 홀, 18번 챌린지 티샷 등 시그니처 홀로 유명합니다. 열대 자연 풍광, 잘 정비된 코스 디자인, 그리고 세계적 수준의 서비스가 조화를 이루는 라구나 골프 푸켓은 푸켓을 찾는 골퍼라면 반드시 경험해 볼 만한 매력적인 목적지입니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '500바트(카트 미이용 시) / 1,000바트(골퍼와 2인 1카트로 이용 시 또는 단독으로 직접 카트 운전하여 이용 시) / 1,400바트(카트와 캐디 이용 시)', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Loch Palm Golf Club', '로치 팜 골프 클럽', 'TH', 'HKT', 18, '38 Moo 5 Vichitsongkram Rd., Kathu District, Phuket 83120, Thailand.', '66818936302', 'https://www.mbkgolf.com/loch-palm/', 4, 'Y', NULL, 'Dr. Sukitti Klangvisai', 'N', 2, 'N', '티프웨이 419 잔디', '파스팔럼 씨아일 2000', 45, 'https://maps.app.goo.gl/W63sP7qqA1pyXx9A9', '푸켓 중심부 카투 지역에 위치한 18홀 파 72 챔피언십 코스로, ‘푸켓의 가장 친근한 골프장’이라는 별칭을 가진 명소입니다. 약 6,555야드 규모의 코스는 푸켓에서 가장 큰 담수호인 ‘크리스탈 레이크’를 중심으로 설계되어 전반부 9홀은 호수를 따라 이어지고, 후반부 9홀은 산악 지형을 배경으로 펼쳐집니다. 워터 해저드와 벙커가 적절히 배치되어 있어 초보자에게는 부담을 덜 주면서도 숙련자에게는 전략적 도전을 제공합니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '1600', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Mission Hills Phuket Golf Resort', '미션 힐스 푸켓 골프 리조트', 'TH', 'HKT', 18, '195 Moo 4 Pa khlok, Amphur Thalang, Phuket 83110 Thailand', '66894509999', 'https://www.missionhillsphuket.com/', 5, 'Y', NULL, 'Jack Nicklaus', 'N', 2, 'N', '티프웨이 419 잔디', '파스팔럼 씨아일 2001', 15, 'https://maps.app.goo.gl/rEpA1k472xvet7sH6', '잭 니클라우스 디자인의 18홀 파 72 챔피언십 코스로, 2004년 개장 이래 푸켓 북동부 해안가 맹그로브 숲과 안다만 해의 숨막히는 전망을 자랑합니다. 블랙 티 기준 6,806야드에 달하는 전장은 전략적인 워터 해저드와 백사장 벙커를 활용해 코스 난이도를 높입니다. 전반부의 2번 홀은 인상적인 아일랜드 그린으로, 4번 홀은 모래 바다 한가운데 그린이 떠 있는 듯한 설계로 유명하며, 12번 홀은 긴 거리와 협소한 페어웨이, 그리고 놀라운 바다 조망으로 시그니처 홀로 꼽힙니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '500', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Phuket country_code Club (Old Course)', '푸켓 컨트리 클럽 (올드코스)', 'TH', 'HKT', 18, '80/1 Vichitsongkram Rd, Moo 7, Katu District , Phuket 83120, Thailand', '6676319200', 'http://www.phuketcountry_codeclub.com/', 5, 'Y', NULL, 'Dr. Sukitti Klangvisai', 'N', 2, 'N', NULL, NULL, 40, 'https://maps.app.goo.gl/upAHWZedNvZiWsGF6', '1989년에 개장한 푸켓 최초의 18홀 챔피언십 골프 코스로 수많은 국내외 대회를 개최한 유서 깊은 명소입니다. 코스는 언듈레이션이 있는 전반부, 평탄한 중반부, 숲을 통과하는 후반부로 구성되어 있어 다양한 전략적 플레이 경험과 재미를 제공합니다. 특히 10번 홀은 호수를 끼고 도는 도그레그 설계로 유명하며, 호수를 가로질러 직접 온그린을 노릴 수 있는 재미를 선사합니다. 후반 9홀은 워터 해저드와 아일랜드 그린이 등장하는 등 다양한 골퍼의 실력을 충족시키는 코스 난이도를 갖추고 있습니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '700', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Red Mountain Golf Club', '레드 마운틴 골프 클럽', 'TH', 'HKT', 18, '119 Moo 4 Vichitsongkram Rd.,Kathu District, Phuket 83120, Thailand', '6676322000', 'https://www.mbkgolf.com/red-mountain/', 4, 'Y', NULL, 'Johnathan Morrow', 'N', 3, 'N', '파스팔럼', '노보텍 버뮤다', 40, 'https://maps.app.goo.gl/r4cXojr4W32MTf3LA', '2007년 개장한 18홀 파 72 코스로, 푸켓 중심부 카투 지역의 폐주석 광산 부지를 활용해 울창한 정글과 붉은 바위 절벽, 협곡 위에 정교하게 설계된 명품 코스입니다. 약 6,800야드에 이르는 전장은 경사와 고저 차가 극명하며, 좁은 페어웨이와 자연 해저드가 절묘하게 조합되어 골퍼에게 깊은 전략적 판단을 요구합니다. 특히 17번 홀은 폭포처럼 깎아 내린 내리막 티샷과 수목이 우거진 계곡을 가로지르는 시그니처 코스로, 강렬한 인상을 선사합니다. 레드 마운틴은 ‘푸켓에서 가장 도전적인 코스’로 불리며, 아시아 최고 수준의 골프장 중 하나로도 자주 언급됩니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '1600', 1);
-- ------------------------------------------------------------
INSERT INTO golf_course (name_en, name_kr, country_code, city_code, hole_count, address, phone, website, max_golfer, single_play, double_play, course_designer, price_option, difficulty, night_golf_yn, fairway_info, green_info, airport_time, map_url, description) VALUES ('Santiburi Samui country_code Club', '산티부리 사무이 컨트리 클럽', 'TH', 'HKT', 18, '12/15 Moo 4 Tambol MaeNam, Ampher Koh Samui, SuratThani 84330', '6677425031', 'https://www.facebook.com/santiburisamui/', 4, 'Y', NULL, 'Edward Thiele & Pirapon Namatra', 'L', 3, 'N', '파스팔럼', '티프이글 버뮤다', 220, 'https://maps.app.goo.gl/QgmQpwM45WuL7SXK7', '코사무이 북부 해안의 완만한 산지에 자리한 산티부리 사무이 컨트리 클럽은 코코넛 농장과 울창한 열대림 속을 가로지르는 18홀 파 72 챔피언십 코스로, 여러 국제 대회를 유치한 명문 코스입니다. 코는 높낮이가 다양한 지형을 활용해 정확한 샷을 요구하며, 좁은 페어웨이와 광활한 그린이 균형을 이루는 설계가 특징입니다. 특히 17번 파 5 홀은 블라인드 티샷 이후 펼쳐지는 푸른 바다와 백사장을 향한 드라마틱한 경관이 어우러진 시그니처 홀이며, 티샷 이후의 풍경 변화가 큰 매력을 더합니다. 코스 중간 중간에는 폭포, 개울, 자연 계곡, 코코넛 나무 숲 등이 조화를 이루며, 플레이 내내 열대 자연의 풍요로움을 경험할 수 있는 것이 특징입니다.');
SET @gid = LAST_INSERT_ID();
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_covenants', '의무', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.caddy_rule', '태국 골프장은 캐디피와는 별도로 캐디팁을 주고 있습니다.
캐디팁은 골프장에 따라 다르나, 18홀당 400바트 ~ 500바트 정도의 캐디팁이 일반적입니다.
캐디팁은 라운딩 종료 후, 캐디에게 직접 현금으로 지불해 주시면 됩니다.', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.rain_check', '골프장 정책에 따름', 1);
INSERT INTO locale_text (target_idx, target_category, text, created_member_idx) VALUES (@gid, 'golf_course.gallery_fee', '1800', 1);
-- ------------------------------------------------------------
