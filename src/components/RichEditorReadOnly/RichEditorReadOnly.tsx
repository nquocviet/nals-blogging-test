import React from 'react';
import {
  Editor,
  EditorState,
  convertFromRaw,
  CompositeDecorator,
  RawDraftContentState
} from 'draft-js';
import {
  findLinkEntities,
  getBlockStyle,
  styleMap,
  LinkComponent
} from '../RichEditor/RichEditor';

type RichEditorReadOnlyProps = {
  rawContent: RawDraftContentState;
};

const RichEditorReadOnly: React.FunctionComponent<RichEditorReadOnlyProps> = ({
  rawContent
}) => {
  const decorator = new CompositeDecorator([
    {
      strategy: findLinkEntities,
      component: LinkComponent
    }
  ]);
  const editorState = EditorState.createWithContent(
    convertFromRaw(rawContent),
    decorator
  );

  return (
    <Editor
      blockStyleFn={getBlockStyle}
      customStyleMap={styleMap}
      editorState={editorState}
      onChange={() => null}
      readOnly
    />
  );
};

RichEditorReadOnly.displayName = 'RichEditorReadOnly';

export default RichEditorReadOnly;
