function DeleteGroupModal({
  showDeleteModal,
  setShowDeleteModal,
  confirmDeleteGroup,
  deleteError
}) {

  if (!showDeleteModal) return null;

  return (

    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">

      <div className="glass-card p-6 w-[90%] max-w-md space-y-5">

        {/* TITLE */}
        <h2 className="text-xl font-semibold text-white">
          Delete Group
        </h2>

        {deleteError ? (

          <>
            <p className="text-red-400 text-sm">
              {deleteError}
            </p>

            <div className="flex justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="glass-card px-4 py-2 text-sm"
              >
                OK
              </button>
            </div>
          </>

        ) : (

          <>
            {/* WARNING TEXT */}
            <p className="text-gray-300 text-sm leading-relaxed">
              This action will permanently delete the group and all associated data.
              This cannot be undone.
            </p>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 pt-2">

              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl text-sm bg-white/5 border border-white/10 hover:bg-white/10 transition"
              >
                Cancel
              </button>

              <button
                onClick={confirmDeleteGroup}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition"
              >
                Delete
              </button>

            </div>
          </>

        )}

      </div>

    </div>

  );

}

export default DeleteGroupModal;