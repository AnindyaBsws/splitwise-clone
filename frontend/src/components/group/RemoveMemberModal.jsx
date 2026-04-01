function RemoveMemberModal({
  showRemoveModal,
  setShowRemoveModal,
  memberDetails,
  selectedMember,
  deleteMember
}) {

  if (!showRemoveModal) return null;

  const hasDebt =
    memberDetails &&
    memberDetails.status &&
    memberDetails.status.includes("Debts");

  return (

    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">

      <div className="glass-card p-6 w-[90%] max-w-md space-y-5">

        {/* TITLE */}
        <h2 className="text-xl font-semibold text-white">
          Remove Member
        </h2>

        {hasDebt ? (

          <>
            {/* ERROR STATE */}
            <p className="text-red-400 text-sm leading-relaxed">
              This member has pending debts. Clear all balances before removing them.
            </p>

            <div className="flex justify-end">
              <button
                onClick={() => setShowRemoveModal(false)}
                className="glass-card px-4 py-2 text-sm"
              >
                OK
              </button>
            </div>
          </>

        ) : (

          <>
            {/* CONFIRM TEXT */}
            <p className="text-gray-300 text-sm leading-relaxed">
              Are you sure you want to remove{" "}
              <span className="text-white font-medium">
                {selectedMember?.name}
              </span>{" "}
              from this group?
            </p>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 pt-2">

              <button
                onClick={() => setShowRemoveModal(false)}
                className="px-4 py-2 rounded-xl text-sm bg-white/5 border border-white/10 hover:bg-white/10 transition"
              >
                Cancel
              </button>

              <button
                onClick={deleteMember}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition"
              >
                Remove
              </button>

            </div>
          </>

        )}

      </div>

    </div>

  );

}

export default RemoveMemberModal;