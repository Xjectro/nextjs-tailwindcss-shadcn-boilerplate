export type ApiError = {
  status: number;
  message: string;
  code?: string;
  details?: unknown;
};

export async function handleApiError(error: unknown): Promise<ApiError> {
  // fetch response error
  if (error instanceof Response) {
    let message = 'Something went wrong';

    try {
      const data = await error.json();
      message = data?.message || message;
    } catch {}

    return {
      status: error.status,
      message,
    };
  }

  // network / runtime error
  if (error instanceof Error) {
    return {
      status: 0,
      message: error.message,
    };
  }

  return {
    status: 0,
    message: 'Unknown error',
  };
}
