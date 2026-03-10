import api from "../../api/axios";
import { useState, useRef, useEffect } from "react";

function MemberList({
  members,
  groupInfo,
  currentUserId,
  openRemoveModal,
  groupId,
  fetchMembers
}) {

  if (!members || !groupInfo) {
    return <div className="p-6">Loading members...</div>;
  }

  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef();

  const isCreator =
    Number(groupInfo.created_by) === Number(currentUserId);

  const currentUser = members.find(
    (m) => Number(m.user_id) === Number(currentUserId)
  );

  const isAdmin = currentUser?.role === "admin";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const updateRole = async (userId, role) => {

    try {

      await api.put(`/api/groups/${groupId}/members/${userId}/role`, {
        role
      });

      setOpenMenu(null);
      fetchMembers();

    } catch (err) {

      console.error(err);
      alert(err.response?.data?.error || "Failed to update role");

    }

  };

  const avatarColors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-indigo-500"
  ];

  const getAvatarColor = (name) => {
    const index = name.charCodeAt(0) % avatarColors.length;
    return avatarColors[index];
  };

  // Sort members: Creator → Admin → Member
  const sortedMembers = [...members].sort((a, b) => {

    const rolePriority = {
      creator: 1,
      admin: 2,
      member: 3
    };

    if (rolePriority[a.role] !== rolePriority[b.role]) {
      return rolePriority[a.role] - rolePriority[b.role];
    }

    // fallback alphabetical
    return a.name.localeCompare(b.name);

  });

  return (

    <div className="bg-white border rounded-xl shadow-sm p-6">

      <h2 className="text-xl font-semibold mb-4">Members</h2>

      {sortedMembers.map((member) => {

        const isCreatorMember = member.role === "creator";

        return (

          <div
            key={member.user_id}
            className="flex justify-between items-center border rounded-lg p-3 mb-2"
          >

            {/* LEFT SIDE */}

            <div className="flex items-center gap-3">

              <div
                className={`${getAvatarColor(member.name)} text-white rounded-full w-8 h-8 flex items-center justify-center`}
              >
                {member.name[0].toUpperCase()}
              </div>

              <div className="flex flex-col">

                <div className="font-medium">
                  {member.name}
                </div>

                <div className="mt-1">

                  {member.role === "creator" && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      Creator
                    </span>
                  )}

                  {member.role === "admin" && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      Admin
                    </span>
                  )}

                  {member.role === "member" && (
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      Member
                    </span>
                  )}

                </div>

              </div>

            </div>

            {/* ACTION MENU */}

            {(isCreator || isAdmin) &&
              member.role !== "creator" &&
              member.user_id !== currentUserId && (

              <div className="relative">

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenu(
                      openMenu === member.user_id
                        ? null
                        : member.user_id
                    );
                  }}
                  className="text-gray-600 hover:text-black text-lg"
                >
                  ⋮
                </button>

                {openMenu === member.user_id && (

                  <div
                    ref={menuRef}
                    className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-md z-20"
                  >

                    {isCreator && !isCreatorMember && (

                      member.role === "admin" ? (

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateRole(member.user_id, "member");
                          }}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Demote to Member
                        </button>

                      ) : (

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateRole(member.user_id, "admin");
                          }}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Promote to Admin
                        </button>

                      )
                    )}

                    {(isCreator || isAdmin) && (

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openRemoveModal(member);
                          setOpenMenu(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                      >
                        Remove Member
                      </button>

                    )}

                  </div>

                )}

              </div>

            )}

          </div>

        );

      })}

    </div>

  );

}

export default MemberList;