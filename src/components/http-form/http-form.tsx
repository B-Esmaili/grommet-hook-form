import useAxios from "axios-hooks";
import { FormBuilder } from "../form-builder";
import React, { useEffect } from "react";
import { HttpFormProps } from "./types";
import { Box, Button, Spinner } from "grommet";
import { useGHFContext } from "context";

const successCodes = [200, 201, 202];

const HttpForm: React.FC<HttpFormProps> = (props) => {
  let {
    fields,
    request,
    onSuccess,
    onError,
    model,
    loadingIndicator,
    submitButton,
    resetButton,
    ...rest
  } = props;

  let { translate: T } = useGHFContext();
  let [{ loading, data, error, response }, submitToServer] = useAxios(request, {
    manual: true,
  });

  useEffect(() => {
    if (response?.status && successCodes.indexOf(response?.status) != -1) {
      onSuccess && onSuccess(data);
    }
  }, [data]);

  useEffect(() => {
    onError && onError(data);
  }, [error]);

  const handleSubmit = (data: any) => {
    submitToServer({
      data
    });
  };

  return (
    <FormBuilder {...rest} fields={fields} onSubmit={handleSubmit} model={model}>
      {submitButton && (
        <Button
          type="submit"
          primary
          icon={(loading && !loadingIndicator) ? <Spinner /> :<div/>}
          label={
            <Box>
            {typeof submitButton === "boolean"
              ? T("form.submit.label")
              : submitButton}
          </Box>
          }
        />
      )}
    </FormBuilder>
  );
};

HttpForm.defaultProps = {
  submitButton: true,
  resetButton: false,
};

export { HttpForm };
