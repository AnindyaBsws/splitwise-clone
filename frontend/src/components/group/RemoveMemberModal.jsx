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

        {/* glow based on state */}
        <div className={`absolute inset-0 pointer-events-none rounded-2xl opacity-60
          ${
            hasDebt
              ? "bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.12),transparent_60%)]"
              : "bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.12),transparent_60%)]"
          }
        `} />

        <div className="relative z-10">

          <h2 className="text-xl font-semibold text-white tracking-tight mb-4">
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

                <span className="font-semibold text-white">
                  {selectedMember?.name}
                </span>

                {" "}from this group?

                <span className="block mt-1 text-sm text-[#6B7280]">
                  This action will remove all access for this member.
                </span>

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
                  className="btn-danger px-4 py-2"
                >
                  Remove
                </button>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>

  );
}

export default RemoveMemberModal;