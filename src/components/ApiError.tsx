import React from 'react';

type ApiErrorProps = {
  className?: string,
  error: {
    message: string
    response?: {
      status: number
      data: {
        message: string
      }
    }
  }
}

function ApiError({ className, error }: ApiErrorProps) {

  const classList = ("text-red-600 font-medium " + className);

  if (error) {
    if (error.message) {
      return (
        <div className={classList} role="alert">
          {error.message}
        </div>
      );
    } else if (
      error.response &&
      error.response.status !== 401 &&
      error.response.data &&
      error.response.data.message
    ) {
      return (
        <div className={classList} role="alert">
          {error.response.data.message}
        </div>
      );
    }
  }
  return <div></div>;
}

export default ApiError;
