'use client';

import * as React from 'react';

import { Button } from '~/components/ui/button';
import { deleteTemplate } from './actions';

interface DeleteTemplateProps {
  templateId: string;
  disabled: boolean;
  onStarted?: () => void;
  onDeleted?: () => void;
  onError?: (error: string) => void;
}
export default function DeleteTemplate({ templateId, disabled, onStarted, onDeleted, onError }: DeleteTemplateProps) {
  const [deleteClicked, setDeleteClicked] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const deleteTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const handleDeleteFirstClicked = () => {
    setDeleteClicked(true);
    if (deleteTimeout.current) {
      clearTimeout(deleteTimeout.current);
    }
    deleteTimeout.current = setTimeout(() => {
      setDeleteClicked(false);
    }, 1000);
  };

  const handleDeleteSecondClicked = () => {
    startTransition(() => {
      onStarted?.();
      deleteTemplate(templateId).then((result) => {
        if (result.error) {
          onError?.(result.error);
          return;
        }
        onDeleted?.();
      });
    });
  };

  return (
    <Button
      variant="destructive"
      type="button"
      onClick={() => {
        if (deleteClicked) {
          handleDeleteSecondClicked();
        } else {
          handleDeleteFirstClicked();
        }
      }}
      onMouseLeave={() => setDeleteClicked(false)}
      disabled={disabled}
    >
      {deleteClicked ? 'Are you sure?' : 'Delete'}
    </Button>
  );
}
