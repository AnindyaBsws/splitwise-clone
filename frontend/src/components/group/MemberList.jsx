function MemberList({
  members,
  groupInfo,
  currentUserId,
  openRemoveModal
}) {

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6">

      <h2 className="text-xl font-semibold mb-4">Members</h2>

      {members.map((member) => (

        <div
          key={member.user_id}
          className="flex justify-between items-center border rounded-lg p-3 mb-2"
        >

          <div className="flex items-center gap-2">

            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
              {member.name[0]}
            </div>

            {member.name}

          </div>

          {groupInfo &&
            Number(groupInfo.created_by) === Number(currentUserId) &&
            member.user_id !== currentUserId && (

              <button
                onClick={() => openRemoveModal(member)}
                className="text-red-600"
              >
                🗑
              </button>

          )}

        </div>

      ))}

    </div>
  );
}

export default MemberList;