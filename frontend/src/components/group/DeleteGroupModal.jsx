function DeleteGroupModal({
  showDeleteModal,
  setShowDeleteModal,
  confirmDeleteGroup,
  deleteError
}) {

  if (!showDeleteModal) return null;

  return (

    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl shadow-lg p-6 w-[420px]">

        <h2 className="text-xl font-semibold mb-4">
          Delete Group
        </h2>

        {deleteError ? (

          <div>

            <p className="text-red-600 mb-6">
              {deleteError}
            </p>

            <div className="flex justify-end">

              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                OK
              </button>

            </div>

          </div>

        ) : (

          <div>

            <p className="mb-6">
              Are you sure you want to delete this group?
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={confirmDeleteGroup}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Yes Delete
              </button>

            </div>

          </div>

        )}

      </div>

    </div>

  );
}

export default DeleteGroupModal;