import * as ftp from 'basic-ftp'
import * as fs from 'fs'
import * as path from 'path'
import { ftpConfig } from './ftpConfig'
import { randomUUID } from 'crypto'

// This module should only be imported on the server side
if (import.meta.client) {
  throw new Error('FtpUtils can only be used on the server side')
}

/**
 * FTP 이미지 업로드를 위한 유틸리티 클래스
 */
export class FtpUtils {
  private client: ftp.Client
  private readonly allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  private readonly maxSizeInBytes: number = 10 * 1024 * 1024 // 5MB

  constructor() {
    this.client = new ftp.Client()
    this.client.ftp.verbose = process.env.NODE_ENV === 'development'
  }

  /**
   * 파일 타입 체크
   * @param mimeType 파일의 MIME 타입
   * @returns 허용된 타입인지 여부
   */
  public checkFileType(mimeType: string): boolean {
    return this.allowedTypes.includes(mimeType)
  }

  /**
   * 파일 용량 체크
   * @param sizeInBytes 파일 크기 (바이트)
   * @returns 허용된 크기인지 여부
   */
  public checkFileSize(sizeInBytes: number): boolean {
    return sizeInBytes <= this.maxSizeInBytes
  }

  /**
   * 랜덤 파일 이름 생성
   * @param originalFilename 원본 파일 이름
   * @returns 랜덤 생성된 파일 이름 (확장자 포함)
   */
  public generateRandomFilename(originalFilename: string): string {
    const extension = path.extname(originalFilename)
    const randomString = randomUUID().replace(/-/g, '')
    const timestamp = Date.now()
    
    return `${randomString}_${timestamp}${extension}`
  }

  // SHA-256 해시 함수
  public async sha256Hash(str: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = new Uint8Array(hashBuffer);
    const hashBase64 = btoa(String.fromCharCode(...hashArray));
    
    // URL 안전한 Base64로 변환
    return hashBase64
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
  }

  /**
   * FTP 서버에 연결
   * @returns 연결 성공 여부
   */
  public async connect(): Promise<boolean> {
    try {
      // 먼저 구성된 설정으로 연결 시도
      try {
        await this.client.access({
          host: ftpConfig.host,
          user: ftpConfig.username,
          password: ftpConfig.password,
          secure: ftpConfig.secure
        })
        return true
      } catch (secureError) {
        // AUTH 오류가 발생하면 비보안 연결 시도
        if (ftpConfig.secure && secureError.toString().includes('AUTH')) {
          console.log('Secure 연결 실패, 비보안 연결 시도...')
          
          // 새 클라이언트 생성 (이전 연결 시도가 실패하면 새로 생성해야 함)
          this.client = new ftp.Client()
          this.client.ftp.verbose = process.env.NODE_ENV === 'development'
          
          await this.client.access({
            host: ftpConfig.host,
            user: ftpConfig.username,
            password: ftpConfig.password,
            secure: false // 비보안 연결 시도
          })
          return true
        } else {
          // 다른 오류의 경우 예외 처리
          throw secureError
        }
      }
    } catch (error) {
      console.error('FTP 연결 실패:', error)
      return false
    }
  }

  /**
   * FTP 연결 종료
   */
  public disconnect(): void {
    this.client.close()
  }

  /**
   * 날짜별 폴더 생성
   * @returns 날짜별 폴더 경로
   */
  private createDateFolder(): string {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}/${month}/${day}`
  }

  /**
   * 경로가 존재하는지 확인하고 없으면 생성
   * @param path 경로
   */
  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      // 디렉토리가 존재하는지 확인하고 없으면 생성
      await this.client.ensureDir(dirPath);
    } catch {
      // 디렉토리가 이미 존재하는 경우 무시해도 됨
      console.log(`폴더 생성 중 오류 (이미 존재할 수 있음): ${dirPath}`);
    }
  }

  /**
   * 이미지 파일 업로드
   * @param localFilePath 로컬 파일 경로
   * @param mimeType 파일 MIME 타입
   * @param uploadPath 업로드할 경로 (선택 사항, 기본값은 날짜별 폴더)
   * @returns 업로드된 파일의 URL 또는 에러 메시지
   */
  public async uploadImage(localFilePath: string, mimeType: string, uploadPath?: string): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      // 파일 타입 체크
      if (!this.checkFileType(mimeType)) {
        return { success: false, error: '허용되지 않는 파일 형식입니다.' }
      }

      // 파일 크기 체크
      const stats = fs.statSync(localFilePath)
      if (!this.checkFileSize(stats.size)) {
        return { success: false, error: '파일 크기가 허용 범위를 초과했습니다.' }
      }

      // FTP 연결
      const connected = await this.connect()
      if (!connected) {
        return { success: false, error: 'FTP 서버 연결에 실패했습니다.' }
      }

      // 랜덤 파일 이름 생성
      const originalFilename = path.basename(localFilePath)
      const randomFilename = this.generateRandomFilename(originalFilename)

      // 업로드 경로 설정 (uploadPath 파라미터가 있으면 사용, 없으면 날짜별 폴더 사용)
      const dirPath = `images/${uploadPath || this.createDateFolder()}`
      
      // 경로가 존재하는지 확인하고 없으면 생성
      await this.ensureDirectoryExists(dirPath)
      
      // 업로드 경로 설정
      const remotePath = `/${dirPath}`
      await this.client.cd(remotePath)

      // 파일 업로드
      await this.client.uploadFrom(localFilePath, randomFilename)

      // 연결 종료
      this.disconnect()

      // 업로드된 파일의 URL 반환
      const fileUrl = `${ftpConfig.baseUrl}${remotePath}/${randomFilename}`
      return { success: true, url: fileUrl }
    } catch (err) {
      this.disconnect()
      console.error('이미지 업로드 실패:', err)
      return { success: false, error: '이미지 업로드 중 오류가 발생했습니다.' }
    }
  }

  /**
   * 여러 개의 파일(Buffer 기반, 예: 프론트 File -> 서버 Buffer 변환) 배열을 FTP에 업로드
   * @param files 업로드할 파일 배열 ({ buffer, originalname, mimetype })
   * @param uploadPath 업로드 경로
   * @returns 업로드된 파일의 URL 배열
   */
  public async uploadFilesFromBuffer(
    files: { buffer: Buffer, originalname: string, mimetype: string }[],
    uploadPath: string
  ): Promise<string[]> {
    const urls: string[] = []
    try {
      const connected = await this.connect()
      if (!connected) throw new Error('FTP 서버 연결에 실패했습니다.')
      const dirPath = `images/${uploadPath}`
      await this.ensureDirectoryExists(dirPath)
      const remotePath = `/${dirPath}`
      await this.client.cd(remotePath)
      for (const file of files) {
        if (!this.checkFileType(file.mimetype)) continue
        if (!this.checkFileSize(file.buffer.length)) continue
        const randomFilename = this.generateRandomFilename(file.originalname)
        // 임시 파일 저장
        const tempPath = path.join(process.cwd(), 'tmp', randomFilename)
        fs.mkdirSync(path.dirname(tempPath), { recursive: true })
        fs.writeFileSync(tempPath, file.buffer)
        try {
          await this.client.uploadFrom(tempPath, randomFilename)
          const fileUrl = `${ftpConfig.baseUrl}${remotePath}/${randomFilename}`
          urls.push(fileUrl)
        } finally {
          fs.unlinkSync(tempPath)
        }
      }
      this.disconnect()
      return urls
    } catch (err) {
      this.disconnect()
      console.error('여러 파일 업로드 실패:', err)
      return urls
    }
  }
}
