import { defineEventHandler, setResponseStatus } from "h3";
import { getPool, testConnection } from "~/server/utils/db";
import type { RowDataPacket, FieldPacket } from "mysql2";
import type { Pool } from "mysql2/promise";
import { writeFile, mkdir, readdir, stat, rename } from "fs/promises";
import { join } from "path";
import { homedir } from "os";

// Google Feeds 출력 디렉토리 이름
const GOOGLE_FEEDS_DIR_NAME = "google_feeds";

interface CountRow extends RowDataPacket {
  total: number;
}

interface GolfCourseRow extends RowDataPacket {
  course_idx: number;
  name_kr: string;
  name_en: string;
  city_code: string;
  country_code: string;
  address: string;
  phone: string;
  website: string;
  description: string;
  round_start: string;
  round_price: number | null;
  created_at: Date;
  region_name: string;
  location: string;
  airport_time: number;
  city_time: number;
  image: string | null;
  latitude?: number | null;
  longitude?: number | null;
  country_name?: string;
  country_name_en?: string;
  city_name?: string;
  city_name_en?: string;
}

/**
 * 전체 골프장 정보를 가져오는 함수
 * @param pool - 데이터베이스 연결 풀
 * @returns 골프장 목록과 전체 개수
 */
async function getAllGolfCourses(pool: Pool) {
  // Count query
  const countQuery = `
    SELECT COUNT(*) as total
    FROM golf_course c
    WHERE c.course_status = 'Y'
  `;
  const [countRows] = (await pool.query(countQuery)) as [
    CountRow[],
    FieldPacket[]
  ];
  const total = countRows?.[0]?.total ?? 0;

  // Data query - 모든 골프장 정보
  const query = `
    SELECT
      c.course_idx,
      c.name_kr,
      c.name_en,
      c.city_code,
      c.country_code,
      c.address,
      c.phone,
      c.website,
      c.description,
      c.round_start,
      p.min_price as round_price,
      c.created_at,
      '' as region_name,
      CONCAT('#', (SELECT country_name FROM country_code WHERE country_code = c.country_code LIMIT 1), ' #',
        (SELECT city_name FROM country_code WHERE city_code = c.city_code LIMIT 1)) as location,
      (SELECT country_name FROM country_code WHERE country_code = c.country_code LIMIT 1) as country_name,
      (SELECT country_name_en FROM country_code WHERE country_code = c.country_code LIMIT 1) as country_name_en,
      (SELECT city_name FROM country_code WHERE city_code = c.city_code LIMIT 1) as city_name,
      (SELECT city_name_en FROM country_code WHERE city_code = c.city_code LIMIT 1) as city_name_en,
      c.airport_time,
      c.city_time,
      c.latitude,
      c.longitude,
      gci.main_image_url as image
    FROM golf_course c
    LEFT JOIN golf_course_image gci ON c.course_idx = gci.course_idx
    LEFT JOIN golf_course_monthly_price p ON c.course_idx = p.course_idx AND p.target_year = DATE_FORMAT(NOW(), '%Y') AND p.target_month = DATE_FORMAT(NOW(), '%m')
    WHERE c.course_status = 'Y'
    ORDER BY c.created_at DESC
  `;

  const [rows] = (await pool.query(query)) as [
    GolfCourseRow[],
    FieldPacket[]
  ];

  // 골프장 데이터 매핑 (위도/경도는 더미데이터로 고정)
  const courses = rows.map((row) => {
    // 쿼리에서 가져오는 필드이지만 인터페이스에 정의되지 않음
    const rowData = row as GolfCourseRow & {
      description?: string;
    };
    
    return {
      id: row.course_idx,
      name_kr: row.name_kr,
      name_en: row.name_en,
      location: row.location,
      price: row.round_price?.toString() || "0",
      image: row.image || "",
      // Google Appointments API용 필드
      entity_id: `appointments-merchant-${row.course_idx}`,
      merchant_id: `appointments-merchant-${row.course_idx}`,
      url: `https://golft.co.kr/course/${row.course_idx}`,
      description: rowData.description || "",
      min_duration_sec: 3600, // 1시간 고정
      latitude: row.latitude ? Number(row.latitude) : 37.5665, // DB 값 또는 기본값 (서울 위도) - 숫자로 변환
      longitude: row.longitude ? Number(row.longitude) : 126.9780, // DB 값 또는 기본값 (서울 경도) - 숫자로 변환
      // 추가 필드
      phone: row.phone || "",
      address: row.address || "",
      country_code: row.country_code || "",
      city_code: row.city_code || "",
      country_name: row.country_name || "",
      country_name_en: row.country_name_en || "",
      city_name: row.city_name || "",
      city_name_en: row.city_name_en || "",
    };
  });

  return {
    courses,
    total,
  };
}

/**
 * Google Appointments API용 JSON 파일 생성
 * @param courses - 골프장 목록
 * @param outputDir - 출력 디렉토리 (기본값: ~/google_feeds)
 */
async function generateGoogleFeeds(
  courses: Array<{
    id: number;
    name_kr: string;
    name_en: string;
    entity_id: string;
    merchant_id: string;
    url: string;
    description: string;
    min_duration_sec: number;
    latitude: number;
    longitude: number;
    price: string;
    phone: string;
    address: string;
    country_code: string;
    city_code: string;
    country_name?: string;
    country_name_en?: string;
    city_name?: string;
    city_name_en?: string;
  }>,
  outputDir?: string
) {
  const timestamp = Math.floor(Date.now() / 1000);

  // 출력 디렉토리 경로 설정 (기본값: ~/google_feeds)
  const finalOutputDir = outputDir 
    ? (outputDir.startsWith("/") ? outputDir : join(homedir(), outputDir))
    : join(homedir(), GOOGLE_FEEDS_DIR_NAME);

  // 출력 디렉토리 생성
  await mkdir(finalOutputDir, { recursive: true });

  // old 디렉토리 경로
  const oldDir = join(finalOutputDir, "old");
  await mkdir(oldDir, { recursive: true });

  // 기존 파일들을 old 디렉토리로 이동
  try {
    const files = await readdir(finalOutputDir);
    const feedFilePattern = /\.(json|filesetdesc\.json)$/;
    
    for (const file of files) {
      // old 디렉토리와 test-data.ts는 제외
      if (file === "old" || file === "test-data.ts") {
        continue;
      }
      
      const filePath = join(finalOutputDir, file);
      const fileStat = await stat(filePath);
      
      // 파일이고, feed 파일 패턴에 맞는 경우에만 이동
      if (fileStat.isFile() && feedFilePattern.test(file)) {
        const oldFilePath = join(oldDir, file);
        await rename(filePath, oldFilePath);
        console.log(`기존 파일 이동: ${file} -> old/${file}`);
      }
    }
  } catch (error) {
    // 파일 이동 실패해도 계속 진행
    console.warn("기존 파일 이동 중 오류 (계속 진행):", error);
  }

  // 1. Action filesetdesc.json
  const actionFilesetDesc = {
    generation_timestamp: timestamp,
    name: "reservewithgoogle.action.v2",
    data_file: [`action_${timestamp}.json`],
  };

  // 2. Action.json
  const actionData = {
    data: courses.map((course) => ({
      entity_id: course.entity_id,
      link_id: `golft-appointment-link-${course.id}`,
      url: course.url,
      actions: [{ appointment_info: {} }],
    })),
  };

  // 3. Entity filesetdesc.json
  const entityFilesetDesc = {
    generation_timestamp: timestamp,
    name: "reservewithgoogle.entity",
    data_file: [`entity_${timestamp}.json`],
  };

  // 4. Entity.json
  const entityData = {
    data: courses.map((course) => {
      // 전화번호 포맷팅 (국가 코드 추가)
      let telephone = course.phone || "";
      if (telephone && !telephone.startsWith("+")) {
        // 태국인 경우 +66 추가
        if (course.country_code === "TH") {
          telephone = telephone.replace(/^0/, "+66");
        } else if (course.country_code === "KR") {
          telephone = telephone.replace(/^0/, "+82");
        }
        if (!telephone.startsWith("+")) {
          telephone = `+${telephone}`;
        }
      }

      // 주소 파싱
      const streetAddress = course.address || course.name_en || course.name_kr;
      const locality = course.city_name_en || course.city_name || "";
      const region = course.city_name_en || course.city_name || "";
      const country = course.country_code || "";
      
      // 주소에서 postal_code 추출 (예: "Chon Buri 20150" -> "20150")
      let postalCode = "";
      if (course.address) {
        const postalMatch = course.address.match(/\b(\d{5})\b/);
        if (postalMatch) {
          postalCode = postalMatch[1];
        }
      }

      return {
        entity_id: course.entity_id,
        name: course.name_kr,
        telephone: telephone || undefined,
        // url: course.url,
        url: 'https://golft.co.kr',
        location: {
          latitude: course.latitude,
          longitude: course.longitude,
          address: {
            country: country,
            region: region,
            locality: locality,
            street_address: streetAddress,
            postal_code: postalCode,
          },
        },
      };
    }),
  };

  // 5. Service filesetdesc.json
  const serviceFilesetDesc = {
    generation_timestamp: timestamp,
    name: "glam.service.v0",
    data_file: [`service_${timestamp}.json`],
  };

  // 6. Service.json
  const serviceData = {
    data: courses.map((course) => {
      // 가격을 마이크로 단위로 변환 (원 단위 * 1,000,000)
      const priceInWon = parseFloat(course.price) || 0;
      const priceMicros = Math.round(priceInWon * 1000000);

      return {
        merchant_id: course.merchant_id,
        service_id: `golft-service-${course.id}`,
        localized_service_name: {
          value: "골프 티타임 예약",
          localized_value: [{ locale: "ko", value: "골프 티타임 예약" }],
        },
        localized_service_category: {
          value: "Golf",
          localized_value: [{ locale: "ko", value: "골프" }],
        },
        localized_service_description: {
          value: course.description || "실시간 골프 티타임 예약 서비스",
          localized_value: [
            {
              locale: "ko",
              value: course.description || "실시간 골프 티타임 예약 서비스",
            },
          ],
        },
        service_price: {
          price_interpretation: "INTERPRETATION_EXACT",
          min_price: {
            price_micros: priceMicros,
            currency_code: "KRW",
          },
        },
        // action_link: [{ url: course.url }], // 
        service_duration: {
          duration_interpretation: "INTERPRETATION_EXACT",
          min_duration_sec: course.min_duration_sec,
        },
        ranking_hint: { score: 1 },
      };
    }),
  };

  // 파일 쓰기
  await writeFile(
    join(finalOutputDir, `action_${timestamp}.filesetdesc.json`),
    JSON.stringify(actionFilesetDesc, null, 2)
  );
  await writeFile(
    join(finalOutputDir, `action_${timestamp}.json`),
    JSON.stringify(actionData, null, 2)
  );
  await writeFile(
    join(finalOutputDir, `entity_${timestamp}.filesetdesc.json`),
    JSON.stringify(entityFilesetDesc, null, 2)
  );
  await writeFile(
    join(finalOutputDir, `entity_${timestamp}.json`),
    JSON.stringify(entityData, null, 2)
  );
  await writeFile(
    join(finalOutputDir, `service_${timestamp}.filesetdesc.json`),
    JSON.stringify(serviceFilesetDesc, null, 2)
  );
  await writeFile(
    join(finalOutputDir, `service_${timestamp}.json`),
    JSON.stringify(serviceData, null, 2)
  );

  return {
    timestamp,
    files: [
      `action_${timestamp}.filesetdesc.json`,
      `action_${timestamp}.json`,
      `entity_${timestamp}.filesetdesc.json`,
      `entity_${timestamp}.json`,
      `service_${timestamp}.filesetdesc.json`,
      `service_${timestamp}.json`,
    ],
  };
}

export default defineEventHandler(async (event) => {
  console.log("[Google Feeds API] Handler called - Path:", event.path);
  
  // 로컬 IP 검증
  const socketIP = event.node.req.socket?.remoteAddress || "";
  const host = String(event.node.req.headers.host || "");
  const isLocalhost = 
    socketIP === "127.0.0.1" || 
    socketIP === "::1" || 
    (socketIP && socketIP.startsWith("127.")) ||
    host.includes("localhost") ||
    host.includes("127.0.0.1");
  
  if (!isLocalhost) {
    setResponseStatus(event, 403);
    return { success: false, error: "Forbidden: Only localhost access is allowed" };
  }

  try {
    // 데이터베이스 연결 확인
    if (!(await testConnection())) {
      return {
        success: false,
        error: "Database connection failed. Please ensure MySQL is running and the credentials are correct.",
      };
    }

    const pool = await getPool();

    // 실제 DB 데이터로 Google Feeds 생성
    const allCoursesData = await getAllGolfCourses(pool);
    const feedResult = await generateGoogleFeeds(allCoursesData.courses);

    return {
      success: true,
      timestamp: feedResult.timestamp,
      files: feedResult.files,
      totalCourses: allCoursesData.total,
      outputDir: "~/google_feeds",
    };
  } catch (error) {
    console.error("Google Feeds 생성 중 오류:", error);
    setResponseStatus(event, 500);
    return {
      success: false,
      error: error instanceof Error ? error.message : "예기치 않은 오류가 발생했습니다.",
    };
  }
});
