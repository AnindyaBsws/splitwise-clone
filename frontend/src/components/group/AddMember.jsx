function AddMember({
  newMemberId,
  setNewMemberId,
  availableUsers,
  handleAddMember
}) {

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6">

      <h2 className="text-xl font-semibold mb-4">Add Member</h2>

      <div className="flex gap-3">

        <select
          value={newMemberId}
          onChange={(e) => setNewMemberId(e.target.value)}
          className="border rounded-lg p-2 flex-1"
        >

          <option value="">Select User</option>

          {availableUsers.map((user) => (
            <option key={user.user_id} value={user.user_id}>
              {user.name}
            </option>
          ))}

        </select>

        <button
          onClick={handleAddMember}
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Add
        </button>

      </div>

    </div>
  );
}

export default AddMember;