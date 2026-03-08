function GroupHeader({ groupInfo, currentUserId, deleteGroup }) {

  if (!groupInfo) return null;

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6 flex justify-between items-center">

      <div>
        <h1 className="text-3xl font-bold">{groupInfo.name}</h1>

        <p className="text-gray-600">
          Created by: {groupInfo.creator_name}
        </p>

        <p className="text-gray-500 text-sm">
          Created on: {new Date(groupInfo.created_at).toLocaleDateString()}
        </p>
      </div>

      {Number(groupInfo.created_by) === Number(currentUserId) && (
        <button
          onClick={deleteGroup}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Delete Group
        </button>
      )}

    </div>
  );
}

export default GroupHeader;