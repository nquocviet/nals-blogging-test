import React, {
  ChangeEvent,
  KeyboardEvent,
  ReactNode,
  useRef,
  useState
} from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  CompositeDecorator,
  DraftBlockType,
  DraftBlockRenderConfig,
  convertToRaw,
  DraftEditorCommand,
  ContentBlock,
  ContentState,
  DraftHandleValue,
  RawDraftContentState,
  convertFromRaw
} from 'draft-js';
import {
  BsTypeBold,
  BsTypeItalic,
  BsTypeUnderline,
  BsListUl,
  BsListOl,
  BsBlockquoteLeft,
  BsTypeStrikethrough,
  BsJustifyLeft,
  BsTextCenter,
  BsJustifyRight,
  BsJustify,
  BsSlashCircle,
  BsLink45Deg,
  BsTypeH1
} from 'react-icons/bs';
import { Tooltip, OverlayTrigger, TooltipProps } from 'react-bootstrap';
import { useOnClickOutside } from '@/hooks';
import * as Immutable from 'immutable';
import clsx from 'clsx';
import styles from './RichEditor.module.css';
import { IconType } from 'react-icons/lib';
import Button from '../Button';
import { useEffect } from 'react';

type TRichEditorProps = {
  classNameContainer?: string;
  classNameInput?: string;
  placeholder?: string;
  minHeight?: number;
  shouldReset?: boolean;
  defaultValue?: ContentState;
  onChange: (value: RawDraftContentState) => void;
};

export const styleMap = {};

export const getBlockStyle = (block: ContentBlock) => {
  switch (block.getType()) {
    case 'left':
      return styles['block-left'];
    case 'center':
      return styles['block-center'];
    case 'right':
      return styles['block-right'];
    case 'justify':
      return styles['block-justify'];
    case 'unordered-list-item':
      return styles['block-ul'];
    case 'ordered-list-item':
      return styles['block-ol'];
    case 'blockquote':
      return styles['block-blockquote'];
    default:
      return '';
  }
};

export const blockRenderMap = Immutable.Map<
  DraftBlockType,
  DraftBlockRenderConfig
>({
  'header-two': {
    element: 'h2'
  },
  'unordered-list-item': {
    element: 'li',
    wrapper: <ul />
  },
  'ordered-list-item': {
    element: 'li',
    wrapper: <ol />
  },
  unstyled: {
    element: 'div'
  }
});

const RichEditor: React.FunctionComponent<TRichEditorProps> = ({
  classNameContainer,
  classNameInput,
  placeholder = 'Enter a description',
  minHeight,
  shouldReset,
  defaultValue,
  onChange: handleChange
}) => {
  const decorator = new CompositeDecorator([
    {
      strategy: findLinkEntities,
      component: LinkComponent
    }
  ]);
  const initialState = defaultValue
    ? () => EditorState.createWithContent(defaultValue, decorator)
    : () => EditorState.createEmpty(decorator);
  const [editorState, setEditorState] = useState(initialState);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState('');
  const ref = useRef<Editor>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const contentState = editorState.getCurrentContent();

  const onClose = () => setShowUrlInput(false);

  useOnClickOutside(inputContainerRef, onClose);

  useEffect(() => {
    if (!defaultValue) return;

    const newEditorState = EditorState.createWithContent(defaultValue);

    setEditorState(newEditorState);
  }, [defaultValue]);

  useEffect(() => {
    if (shouldReset) {
      const newEditorState = EditorState.createWithContent(
        defaultValue
          ? defaultValue
          : convertFromRaw({
              blocks: [],
              entityMap: {}
            }),
        decorator
      );

      setEditorState(newEditorState);
    }
  }, [shouldReset]);

  const onChange = (editorState: EditorState) => {
    const contentState = editorState.getCurrentContent();

    setEditorState(editorState);
    handleChange(convertToRaw(contentState));
  };

  const onFocus = () => {
    if (ref.current) {
      ref.current.focus();
    }
  };

  const onURLChange = (event: ChangeEvent<HTMLInputElement>) =>
    setUrlValue(event.target.value);

  const onLinkInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.which === 13) {
      confirmLink();
    }
  };

  const promptForLink = () => {
    const selection = editorState.getSelection();

    if (!selection.isCollapsed()) {
      const contentState = editorState.getCurrentContent();
      const startKey = editorState.getSelection().getStartKey();
      const startOffset = editorState.getSelection().getStartOffset();
      const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
      const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);
      let url = '';

      if (linkKey) {
        const linkInstance = contentState.getEntity(linkKey);
        url = linkInstance.getData().url;
      }

      setShowUrlInput(true);
      setUrlValue(url);
      setTimeout(() => inputRef.current && inputRef.current.focus(), 0);
    }
  };

  const confirmLink = () => {
    const contentState = editorState.getCurrentContent();

    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      { url: urlValue }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    let nextEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity
    });

    nextEditorState = RichUtils.toggleLink(
      nextEditorState,
      nextEditorState.getSelection(),
      entityKey
    );

    setEditorState(nextEditorState);
    setShowUrlInput(false);
    setUrlValue('');
    setTimeout(() => ref.current && ref.current.focus(), 0);
  };

  const removeLink = () => {
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      setEditorState(RichUtils.toggleLink(editorState, selection, null));
    }
  };

  const checkContent = () => {
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        return true;
      }
      return false;
    }
  };

  const handleKeyCommand = (
    command: DraftEditorCommand,
    editorState: EditorState
  ): DraftHandleValue => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const mapKeyToEditorCommand = (
    event: KeyboardEvent<HTMLElement>
  ): string | null => {
    if (event.keyCode === 9) {
      const newEditorState = RichUtils.onTab(event, editorState, 4);
      if (newEditorState !== editorState) {
        onChange(newEditorState);
      }
      return null;
    }
    return getDefaultKeyBinding(event);
  };

  const toggleBlockType = (blockType: string) => {
    onChange(RichUtils.toggleBlockType(editorState, blockType));
  };

  const toggleInlineStyle = (inlineStyle: string) => {
    onChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  return (
    <div className={clsx(styles['rich-editor'], classNameContainer)}>
      <div className={styles['toolbar']}>
        <InlineStyleControls
          editorState={editorState}
          onToggle={toggleInlineStyle}
        />
        <BlockStyleControls
          editorState={editorState}
          onToggle={toggleBlockType}
        />
        <div className="relative">
          <OverlayTrigger
            placement="top"
            overlay={(props: TooltipProps) => (
              <Tooltip {...props}>Add link</Tooltip>
            )}>
            <span
              role="button"
              className={styles['button-control']}
              onMouseUp={promptForLink}
              aria-label="Add link">
              <BsLink45Deg size={20} />
            </span>
          </OverlayTrigger>
          {showUrlInput && (
            <div ref={inputContainerRef} className={styles['input-container']}>
              <label>
                <div className="mb-0.5 text-sm font-medium text-gray-700">
                  URL
                </div>
                <input
                  onChange={onURLChange}
                  ref={inputRef}
                  className={styles['input']}
                  type="text"
                  value={urlValue}
                  onKeyDown={onLinkInputKeyDown}
                />
              </label>
              <div className="d-flex justify-content-end">
                <Button className="px-2 py-1" onMouseUp={confirmLink}>
                  Insert
                </Button>
              </div>
            </div>
          )}
        </div>
        <OverlayTrigger
          placement="top"
          overlay={(props: TooltipProps) => (
            <Tooltip {...props}>Remove link</Tooltip>
          )}>
          <span
            role="button"
            className={styles['button-control']}
            onMouseUp={removeLink}
            aria-label="Remove link">
            <BsSlashCircle size={18} />
          </span>
        </OverlayTrigger>
      </div>
      <div
        className={clsx(
          'cursor-text px-3 py-2',
          checkContent() && 'rich-editor-hide-placeholder',
          classNameInput
        )}
        style={{
          ...(minHeight && { minHeight: `${minHeight}px` })
        }}
        onClick={onFocus}>
        <Editor
          blockStyleFn={getBlockStyle}
          customStyleMap={styleMap}
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={mapKeyToEditorCommand}
          blockRenderMap={blockRenderMap}
          onChange={onChange}
          placeholder={placeholder}
          ref={ref}
          spellCheck={true}
        />
      </div>
    </div>
  );
};

export const findLinkEntities = (
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: ContentState
) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === 'LINK'
    );
  }, callback);
};

export const LinkComponent = ({
  contentState,
  entityKey,
  children
}: {
  contentState: ContentState;
  entityKey: string;
  children: ReactNode;
}) => {
  const { url } = contentState.getEntity(entityKey).getData();

  return (
    <a href={url} className={styles['link']}>
      {children}
    </a>
  );
};

type TStyleButtonProps = {
  active: boolean;
  icon: IconType;
  label: string;
  style: string;
  onToggle: (style: string) => void;
};

const StyleButton = ({
  active,
  icon: Icon,
  label,
  style,
  onToggle
}: TStyleButtonProps) => {
  const renderTooltip = (props: TooltipProps) => (
    <Tooltip {...props}>{label}</Tooltip>
  );

  return (
    <OverlayTrigger placement="top" overlay={renderTooltip}>
      <span
        role="button"
        className={clsx(
          styles['button-control'],
          active && styles['button-control-active']
        )}
        onMouseDown={(event) => {
          event.preventDefault();
          onToggle(style);
        }}
        aria-label={label}>
        <Icon size={20} />
      </span>
    </OverlayTrigger>
  );
};

const INLINE_STYLES = [
  { icon: BsTypeBold, label: 'Bold', style: 'BOLD' },
  { icon: BsTypeItalic, label: 'Italic', style: 'ITALIC' },
  { icon: BsTypeUnderline, label: 'Underline', style: 'UNDERLINE' },
  { icon: BsTypeStrikethrough, label: 'Strikethrough', style: 'STRIKETHROUGH' }
];

type TInlineStyleControlsProps = {
  editorState: EditorState;
  onToggle: (inlineStyle: string) => void;
};

const InlineStyleControls = ({
  editorState,
  onToggle
}: TInlineStyleControlsProps) => {
  const currentStyle = editorState.getCurrentInlineStyle();

  return (
    <>
      {INLINE_STYLES.map(({ icon, label, style }) => (
        <StyleButton
          key={style}
          active={currentStyle.has(style)}
          icon={icon}
          label={label}
          onToggle={onToggle}
          style={style}
        />
      ))}
    </>
  );
};

const BLOCK_TYPES = [
  { icon: BsTypeH1, label: 'Heading', style: 'header-two' },
  { icon: BsJustifyLeft, label: 'Text left', style: 'left' },
  { icon: BsTextCenter, label: 'Text center', style: 'center' },
  { icon: BsJustifyRight, label: 'Text right', style: 'right' },
  { icon: BsJustify, label: 'Text justify', style: 'justify' },
  { icon: BsListUl, label: 'Unordered list', style: 'unordered-list-item' },
  { icon: BsListOl, label: 'Ordered list', style: 'ordered-list-item' },
  { icon: BsBlockquoteLeft, label: 'Blockquote', style: 'blockquote' }
];

type TBlockStyleControlsProps = {
  editorState: EditorState;
  onToggle: (blockType: string) => void;
};

const BlockStyleControls = ({
  editorState,
  onToggle
}: TBlockStyleControlsProps) => {
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <>
      {BLOCK_TYPES.map(({ icon, label, style }) => (
        <StyleButton
          key={style}
          active={style === blockType}
          icon={icon}
          label={label}
          onToggle={onToggle}
          style={style}
        />
      ))}
    </>
  );
};

RichEditor.displayName = 'RichEditor';

export default RichEditor;
