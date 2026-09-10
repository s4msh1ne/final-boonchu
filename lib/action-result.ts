export type ActionResult<T = undefined> =
  | { success: true; data: T }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<string, string[]>;
    };

export const ACTION_ERROR = "ไม่สามารถดำเนินการได้ กรุณาลองใหม่อีกครั้ง";
