function DeleteGroupModal({
  showDeleteModal,
  setShowDeleteModal,
  confirmDeleteGroup,
  deleteError
}) {

  if (!showDeleteModal) return null;

  return (

    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="card p-6 w-[420px]">

        <h2 className="text-xl font-semibold mb-4 text-white">
          Delete Group
        </h2>

        {deleteError ? (

          <div>

            <p className="text-red-400 mb-6">
              {deleteError}
            </p>

            <div className="flex justify-end">

              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-secondary"
              >
                OK
              </button>

            </div>

          </div>

        ) : (

          <div>

            <p className="mb-6 text-[#9CA3AF]">
              Are you sure you want to delete this group?
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>

              <button
                onClick={confirmDeleteGroup}
                className="px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 transition"
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