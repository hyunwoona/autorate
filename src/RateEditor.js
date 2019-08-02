import React from 'react';
import { Editor } from 'draft-js';

const styles = {
  editor: {
    border: '1px solid rgba(34,36,38,.15)',
    minHeight: '6em',
    maxHeight: '200px',
    overflow: 'auto',
    borderRadius: '.28571429rem'
  }
};

function RateEditor({ editorState, handleEditorStateChange }) {
  const editor = React.useRef(null);

  function focusEditor() {
    editor.current.focus();
  }

  // React.useEffect(() => {
  //   focusEditor()
  // }, []);

  return (
    <div style={styles.editor} onClick={focusEditor}>
    <Editor
        ref={editor}
        editorState={editorState}
        textAlignment="left"
        onChange={handleEditorStateChange}
      />
    </div>
  );
}

export default RateEditor;