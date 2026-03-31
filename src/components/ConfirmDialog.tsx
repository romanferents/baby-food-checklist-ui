import React from 'react';
import { Dialog, Portal, Button, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

interface ConfirmDialogProps {
  visible: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onDismiss: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  onConfirm,
  onDismiss,
  confirmLabel,
  cancelLabel,
  destructive = false,
}: ConfirmDialogProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        {title && <Dialog.Title>{title}</Dialog.Title>}
        <Dialog.Content>
          <Text variant="bodyMedium">{message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>{cancelLabel ?? t('confirmDialog.cancel')}</Button>
          <Button
            onPress={() => {
              onConfirm();
              onDismiss();
            }}
            textColor={destructive ? '#B00020' : undefined}
          >
            {confirmLabel ?? t('confirmDialog.confirm')}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
