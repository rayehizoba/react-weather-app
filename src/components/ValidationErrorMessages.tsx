import React from 'react';
import {ValidationErrors} from "validatorjs";

interface ValidationErrorMessagesProps {
  errors: null | ValidationErrors;
  name: string;
}

function ValidationErrorMessages({errors, name}: ValidationErrorMessagesProps) {

  if (errors && errors[name]) {
    return (
      <>
        {errors[name].map(error => (
          <div key={error} className="text-xs text-red-500/75 font-medium">
            {error}
          </div>
        ))}
      </>
    );
  }

  return null;

}

export default ValidationErrorMessages;
