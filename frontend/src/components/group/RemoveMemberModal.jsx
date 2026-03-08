function RemoveMemberModal({
  showRemoveModal,
  setShowRemoveModal,
  memberDetails,
  selectedMember,
  deleteMember
}) {

  if (!showRemoveModal) return null;

  const balance = memberDetails ? parseFloat(memberDetails.balance) : 0;

  const hasDebt =
    memberDetails &&
    memberDetails.status &&
    memberDetails.status.includes("Debts");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl shadow-lg p-6 w-[420px]">

        <h2 className="text-xl font-semibold mb-4">
          Remove Member
        </h2>

        {hasDebt ? (

          <div>

            <p className="text-red-600 mb-6">
              Debts need to be cleared first for this member.
            </p>

            <div className="flex justify-end">
              <button
                onClick={() => setShowRemoveModal(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                OK
              </button>
            </div>

          </div>

        ) : (

          <div>

            <p className="mb-6">
              Are you sure you want to remove{" "}
              <strong>{selectedMember?.name}</strong> from this group?
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowRemoveModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={deleteMember}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
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