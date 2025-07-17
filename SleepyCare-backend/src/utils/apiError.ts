// קובץ עזר לאיחוד הודעות שגיאה
export interface ApiError {
  status: number;
  error: string;
  message: string;
}

export function apiError(status: number, error: string, message: string): ApiError {
  return { status, error, message };
}
