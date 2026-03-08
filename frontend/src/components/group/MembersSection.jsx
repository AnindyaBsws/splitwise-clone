function MembersSection({
  members,
  groupInfo,
  currentUserId,
  openRemoveModal
}) {
  return (
    <div className="bg-white border rounded-xl shadow-sm p-6">

      <h2 className="text-xl font-semibold mb-4">Members</h2>

      <div className="space-y-3">

        {members.map((member) => (
          <div
            key={member.user_id}
            className="flex justify-between items-center border rounded-lg p-3"
          >

            <div>
              {member.name} ({member.email})

              {groupInfo &&
                Number(groupInfo.created_by) === Number(member.user_id) && (
                  <span className="ml-2 text-yellow-500">👑</span>
                )}
            </div>

            {groupInfo &&
              Number(groupInfo.created_by) === Number(currentUserId) &&
              member.user_id !== currentUserId && (
                <button
                  onClick={() => openRemoveModal(member)}
                  className="text-red-600 hover:text-red-800 text-lg"
                >
                  🗑
                </button>
              )}

          </div>
        ))}

      </div>

    </div>
  );
}

export default MembersSection;