import { FormBuilder } from "../../../../form-builder/form-builder";
import { Box, Button, Drop, Text } from "grommet";
import { FormField, FormFieldType } from "components/form-builder/types";
import { Add, Close } from "grommet-icons";
import { useRef } from "react";

const playersFormFields: FormField[] = [
  {
    name: "name",
    label: "Name",
    type: FormFieldType.Text,
    gridArea: "left",
  },
  {
    name: "lang",
    label: "Language",
    type: FormFieldType.DropDown,
    itemLabelKey: "text",
    itemValueKey: "value",
    placeholder: "Select a language",
    renderItemLabel: ({ text }: any) => (
      <Box
        background="brand"
        pad="xsmall"
        round="xsmall"
        margin={{ horizontal: "xxsmall", vertical: "xxsmall" }}
      >
        <Box direction="row">
          <Text>{text}</Text>
          <Button icon={<Close size="xxsmall" color="light-1"/>}></Button>
        </Box>
      </Box>
    ),
    multiple: true,
    options: [
      {
        text: "English",
        value: "english",
      },
      {
        text: "German",
        value: "german",
      },
      {
        text: "Spanish",
        value: "spanish",
      },
      {
        text: "French",
        value: "french",
      },
      {
        text: "Chines",
        value: "chines",
      },
      {
        text: "Japanese",
        value: "japanese",
      },
    ],
    gridArea: "left",
  },
];

export const Simple = () => {
  let model = { name: "John Nash", lang: "english" };
  let handleSubmit = (values: any) => {
    alert(JSON.stringify(values));
  };

  return (
    <Box width="medium" pad="small" background="light-2">
      <FormBuilder
        onSubmit={handleSubmit}
        fields={playersFormFields}
        model={model}
      >
        <Button
          gridArea="actions"
          icon={<Add />}
          label="Submit"
          type="submit"
          primary
        />
      </FormBuilder>
    </Box>
  );
};

export default {
  title: "Form Builder/Editors/DropDown",
};
