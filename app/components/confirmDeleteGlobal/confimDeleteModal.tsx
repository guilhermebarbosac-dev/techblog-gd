import ButtonPrimary from '../buttonsGlobal/ButtonPrimary';
import TEXTS from '@/app/constants/texts';
import { ConfirmDeleteModalProps } from '@/lib/types';

export const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemDescription
}: ConfirmDeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gray/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-lg shadow-xl sm:max-w-md w-full p-6 animate-fadeIn">
        <h3 className="text-lg font-bold text-primary mb-2">
          {TEXTS.ConfimDeleteModal.title}
        </h3>

        <div className="mb-4">
          <p className="text-sm text-primary">
            {TEXTS.ConfimDeleteModal.itemDescription} <span className="text-primary font-bold">{itemName}</span>?
          </p>
          {itemDescription && (
            <p className="text-sm font-semibold text-muted-foreground mt-1">
              {itemDescription}
            </p>
          )}
          <p className="text-sm text-bg-button-secondary mt-4">
            {TEXTS.ConfimDeleteModal.footerInfo}
          </p>
        </div>

        <div className="flex sm:w-full justify-end space-x-3">
          <ButtonPrimary
            className='w-fit sm:w-[7.625rem] sm:h-10 px-4'
            onClick={onClose}
            type="button"
          >
            {TEXTS.ConfimDeleteModal.buttons.cancel}
          </ButtonPrimary>
          <ButtonPrimary
            onClick={onConfirm}
            type="button"
            className=" w-fit sm:w-[7.625rem] sm:h-10 px-4 bg-button-primary hover:bg-button-primary/80 text-primary"
          >
            {TEXTS.ConfimDeleteModal.buttons.confirm}
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
};