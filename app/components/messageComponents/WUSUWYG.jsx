import React, { useEffect, useState } from 'react';

import ReactQuill from './react-wysiwyg.client'
import { ClientOnly } from "remix-utils/client-only";
import 'react-quill/dist/quill.snow.css';
import EditorToolbar, { modules, formats } from "./EditorToolbar.client";


export default function WUSUWYG({ value, setValue, placeholder }) {


  return (
    <>
      <ClientOnly>
        {() => (
          <>
            <EditorToolbar />
            <ReactQuill
              theme="snow"
              value={value}
              onChange={setValue}
              modules={modules}
              formats={formats}
              placeholder={placeholder}
            />
          </>
        )

        }
      </ClientOnly>
    </>

  )
}





