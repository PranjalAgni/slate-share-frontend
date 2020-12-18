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
interface Props {
  groupId: string;
}

const SyncingEditor: React.FC<Props> = ({ groupId }) => {
  const [text, setText] = useState(initialText);
  const editor = useRef<Editor | null>(null);
  const remote = useRef(false);
  const editorUID = useRef(Date.now().toString());

  useEffect(() => {
    socket.once(INIT_TEXT, (data: ValueJSON) => setText(Value.fromJSON(data)));

    socket.emit(INIT_TEXT_REQUEST, {
      key: groupId,
    });

    const REMOTE_EDITOR_OPERATIONS_GROUPID = `${REMOTE_EDITOR_OPERATIONS}_${groupId}`;
    socket.on(
      REMOTE_EDITOR_OPERATIONS_GROUPID,
      ({
        editorId,
        operations,
      }: {
        editorId: string;
        operations: Operation[];
      }) => {
        if (editorId !== editorUID.current) {
          console.log('Remote editor in the group triggered....');
          remote.current = true;
          operations.forEach((ops: any) => editor.current!.applyOperation(ops));
          remote.current = false;
        }
      }
    );

    return () => {
      socket.off(REMOTE_EDITOR_OPERATIONS_GROUPID);
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
        groupId,
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
