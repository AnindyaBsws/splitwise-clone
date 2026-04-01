function DeleteGroupModal({
  showDeleteModal,
  setShowDeleteModal,
  confirmDeleteGroup,
  deleteError
}) {

  if (!showDeleteModal) return null;

  return (

    <div className="
      fixed inset-0 z-50 flex items-center justify-center
      bg-black/70 backdrop-blur-md
    ">

      <div className="
        relative w-full max-w-md mx-4
        card p-6
        shadow-[0_20px_60px_rgba(0,0,0,0.8)]
        overflow-hidden
      ">

        {/* subtle danger glow */}
        <div className="absolute inset-0 pointer-events-none rounded-2xl
          bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.15),transparent_60%)] opacity-60" />

        {/* CONTENT */}
        <div className="relative z-10">

          <h2 className="text-xl font-semibold text-white tracking-tight mb-4">
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
                <span className="block mt-1 text-sm text-[#6B7280]">
                  This action cannot be undone.
                </span>
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
                  className="btn-danger px-4 py-2"
                >
                  Yes, Delete
                </button>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>

  );
}

export default DeleteGroupModal;