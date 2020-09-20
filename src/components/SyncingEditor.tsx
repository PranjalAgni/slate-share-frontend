import React, { useEffect, useRef, useState } from 'react';
import mitt from 'mitt';
import { Editor } from 'slate-react';
import { initialText } from '../data/text';
import { Operation } from 'slate';

interface Props {}

const emitter = mitt();
const SyncingEditor: React.FC<Props> = () => {
  const [text, setText] = useState(initialText);
  const editor = useRef<Editor | null>(null);
  const remote = useRef(false);
  const editorUID = useRef(`${Date.now()}`);

  useEffect(() => {
    (emitter as any).on('*', (type: string, operation: Operation[]) => {
      if (type !== editorUID.current) {
        remote.current = true;
        operation.forEach((ops) => editor.current!.applyOperation(ops));
        remote.current = false;
      }
    });
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
      emitter.emit(editorUID.current, filteredOperations);
    }
  };
  return (
    <Editor
      ref={editor}
      style={{
        backgroundColor: '#fafafa',
        maxWidth: 800,
        minHeight: 150,
      }}
      value={text}
      onChange={handleChange}
    />
  );
};

export default SyncingEditor;
