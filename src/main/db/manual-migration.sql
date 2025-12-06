-- 알림 기능을 위한 데이터베이스 마이그레이션
-- notified 컬럼 추가 (알림 발송 여부)
ALTER TABLE todos ADD COLUMN notified INTEGER DEFAULT 0;

-- alertTime 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS alert_time_idx ON todos(alert_time);

-- 기존 레코드 중 alertTime이 과거인 것들은 notified=1로 설정 (재알림 방지)
UPDATE todos
SET notified = 1
WHERE alert_time IS NOT NULL
  AND alert_time < strftime('%Y-%m-%d %H:%M', 'now', 'localtime');
