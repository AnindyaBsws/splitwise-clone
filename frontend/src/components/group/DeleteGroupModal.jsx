function DeleteGroupModal({
  showDeleteModal,
  setShowDeleteModal,
  confirmDeleteGroup,
  deleteError
}) {

  if (!showDeleteModal) return null;

  return (

    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="glass-card p-6 w-[420px]">

        <h2 className="text-xl font-semibold mb-4">
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
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
              >
                OK
              </button>

            </div>

          </div>

        ) : (

          <div>

            <p className="mb-6 text-gray-300">
              Are you sure you want to delete this group?
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10"
              >
                Cancel
              </button>

              <button
                onClick={confirmDeleteGroup}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white"
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