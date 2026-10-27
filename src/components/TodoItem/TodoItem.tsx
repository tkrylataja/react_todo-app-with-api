/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  onDelete: (todoId: number) => void;
  isLoading?: boolean;
  onToggleStatus: (todo: Todo) => void;
  onUpdate: (todoId: number, data: Partial<Todo>) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isLoading = false,
  onToggleStatus,
  onUpdate,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === '') {
      onDelete(todo.id);

      return;
    }

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    onUpdate(todo.id, { title: trimmedTitle })
      .then(() => setIsEditing(false))
      .catch(() => {
        /* помилку показує App */
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSave();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setNewTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggleStatus(todo)}
        />
      </label>

      {isEditing && (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            ref={inputRef}
            onChange={event => setNewTitle(event.target.value)}
            onBlur={handleSave}
            onKeyUp={handleKeyUp}
          />
        </form>
      )}

      {!isEditing && (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
