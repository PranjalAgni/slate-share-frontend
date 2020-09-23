import React, { useEffect, useRef, useState } from 'react';
import { Operation, Value, ValueJSON } from 'slate';
import { Editor } from 'slate-react';
import io from 'socket.io-client';
import {
  EDITOR_OPERATIONS,
  INIT_TEXT,
  INIT_TEXT_REQUEST,
  REMOTE_EDITOR_OPERATIONS,
} from '../constants/types';

import { initialText } from '../data/text';

const socket = io(process.env.REACT_APP_WS_SERVER_URL);
interface Props {}

const SyncingEditor: React.FC<Props> = () => {
  const [text, setText] = useState(initialText);
  const editor = useRef<Editor | null>(null);
  const remote = useRef(false);
  const editorUID = useRef(`${Date.now()}`);

  useEffect(() => {
    socket.once(INIT_TEXT, (data: ValueJSON) => {
      console.log('Initial mounting data: ', data);
      setText(Value.fromJSON(data));
    });

    socket.emit(INIT_TEXT_REQUEST);

    socket.on(
      REMOTE_EDITOR_OPERATIONS,
      ({
        editorId,
        operations,
      }: {
        editorId: string;
        operations: Operation[];
      }) => {
        if (editorId !== editorUID.current) {
          remote.current = true;
          operations.forEach((ops: any) => editor.current!.applyOperation(ops));
          remote.current = false;
        }
      }
    );

    return () => {
      socket.off(REMOTE_EDITOR_OPERATIONS);
    };
  }, []);

  const handleChange = ({
    value,
    operations,
  }: {
    value: any;
    operations: any;
  }) => {
    setText(value);

    const editorTypes: string[] = ['set_value', 'set_selection'];

    const filteredOperations = operations
      .filter((ops: any) => {
        if (!ops) return false;
        return (
          !editorTypes.includes(ops.type) &&
          (!ops.data || !ops.data.has('source'))
        );
      })
      .toJS()
      .map((ops: any) => ({ ...ops, data: { source: 'one' } }));

    if (filteredOperations.length && !remote.current) {
      socket.emit(EDITOR_OPERATIONS, {
        editorId: editorUID.current,
        operations: filteredOperations,
        editorText: value,
      });
    }
  };
  return (
    <Editor
      ref={editor}
      style={{
        backgroundColor: '#fafafa',
        width: 400,
        maxWidth: 800,
        minHeight: 150,
      }}
      value={text}
      onChange={handleChange}
    />
  );
};

export default SyncingEditor;
