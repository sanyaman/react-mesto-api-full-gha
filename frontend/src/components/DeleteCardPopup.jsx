import PopupWithForm from "./PopupWithForm";

function DeleteCardPopup({ isOpen, onClose, onDeleteCard, isLoading }) {
  function handleSubmit(e) {
    e.preventDefault();
    onDeleteCard(true);
  }

  return (
    <PopupWithForm
      name="delete"
      title="Вы уверены?"
      isOpen={isOpen ? "popup_opened" : ""}
      onClose={onClose}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      isLoadingCaption="Запуск Адронного Коллайдера..."
      submitcaption="Да"
    ></PopupWithForm>
  );
}

export default DeleteCardPopup;

