import { Story, Meta } from "@storybook/react/types-6-0";
import { FormBuilder } from "../form-builder";
import { FormBuilderProps, FormFieldType } from "../types";
import { Box, Button, Grommet } from "grommet";
import { useFormBuilder } from "../use-form-builder";
import { FormField } from "components";
import { useFormMethods } from "components/hooks";
import { DevTool } from "@hookform/devtools";

const meta: Meta = {
  title: "Form Builder/Using Hooks",
  args: {},
  component: FormBuilder,
};

export default meta;

type Model = {
  textInput: string;
  textInput2: string;
  textInput3: string;
};

const Template: Story<FormBuilderProps> = () => {
  const fields: FormField[] = [
    {
      name: "textInput",
      label: "Text Input:",
      defaultValue: "",
      type: FormFieldType.Text,
    },
    {
      name: "textInput2",
      label: "Text Input:",
      defaultValue: "",
      type: FormFieldType.Text,
    
    },
    {
      name: "textInput3",
      label: "Text Input:",
      defaultValue: "",
      type: FormFieldType.Text,
    },
  ];

  const {
    Form,
    fieldViews: { textInput3 },
  } = useFormBuilder<Model>({ fields  });

  const { ref, methods, watchValue } = useFormMethods();

  return (
    <Grommet>
      {watchValue("textInput3","sdfsdf")}
      {
        methods && (
          <DevTool control={methods.control} placement="top-right" />
        )
      }
      <Form
        onSubmit={(data) => {
          alert(JSON.stringify(data));
        }}
        ref={ref}
      >
        {textInput3}
        <Box fill>  
          <Button
            gridArea="foot"
            type="submit"
            primary
            size="small"
            label="Submit"
            alignSelf="start"
          />
        </Box>
      </Form>
    </Grommet>
  );
};

export const UsingHooks = Template.bind({});
