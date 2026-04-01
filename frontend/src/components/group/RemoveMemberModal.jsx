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

    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="card p-6 w-[420px]">

        <h2 className="text-xl font-semibold mb-4 text-white">
          Remove Member
        </h2>

        {hasDebt ? (

          <div>

            <p className="text-red-400 mb-6">
              Debts need to be cleared first for this member.
            </p>

            <div className="flex justify-end">

              <button
                onClick={() => setShowRemoveModal(false)}
                className="btn-secondary"
              >
                OK
              </button>

            </div>

          </div>

        ) : (

          <div>

            <p className="mb-6 text-[#9CA3AF]">
              Are you sure you want to remove{" "}
              <strong className="text-white">
                {selectedMember?.name}
              </strong>{" "}
              from this group?
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowRemoveModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>

              <button
                onClick={deleteMember}
                className="px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 transition"
              >
                Remove
              </button>

            </div>

          </div>

        )}

      </div>

    </div>

  );
}

export default RemoveMemberModal;