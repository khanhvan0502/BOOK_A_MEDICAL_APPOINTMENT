// Based on: https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/react.html

import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import "./CKEditor.scss";

export const CKEditorComponent = ({ data = "", onChangeData, ...props }) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={data}
      onChange={(event, editor) => {
        const data = editor.getData();
        onChangeData && onChangeData(data);
      }}
      {...props}
    />
  );
};
