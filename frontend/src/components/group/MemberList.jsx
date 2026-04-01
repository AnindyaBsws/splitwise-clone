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
    return <div className="card p-6 text-[#9CA3AF]">Loading members...</div>;
  }

  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef();

  const isCreator =
    Number(groupInfo.created_by) === Number(currentUserId);

  const currentUser = members.find(
    (m) => Number(m.user_id) === Number(currentUserId)
  );

  const isAdmin = currentUser?.role === "admin";

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

  const sortedMembers = [...members].sort((a, b) => {

    const rolePriority = {
      creator: 1,
      admin: 2,
      member: 3
    };

    if (rolePriority[a.role] !== rolePriority[b.role]) {
      return rolePriority[a.role] - rolePriority[b.role];
    }

    return a.name.localeCompare(b.name);

  });

  return (

    <div className="card p-6">

      <h2 className="text-xl font-semibold mb-5 text-white">
        Members
      </h2>

      <div className="space-y-3">

        {sortedMembers.map((member) => {

          const isCreatorMember = member.role === "creator";

          return (

            <div
              key={member.user_id}
              className="p-4 rounded-xl
              bg-[#1A1B21] border border-[#22232A]
              flex justify-between items-center
              hover:bg-[#22232A] transition"
            >

              {/* LEFT SIDE */}

              <div className="flex items-center gap-3">

                <div
                  className={`${getAvatarColor(member.name)} text-white rounded-full w-9 h-9 flex items-center justify-center font-semibold`}
                >
                  {member.name[0].toUpperCase()}
                </div>

                <div className="flex flex-col">

                  <div className="font-medium text-white">
                    {member.name}
                  </div>

                  <div className="mt-1 flex gap-2">

                    {member.role === "creator" && (
                      <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                        Creator
                      </span>
                    )}

                    {member.role === "admin" && (
                      <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                        Admin
                      </span>
                    )}

                    {member.role === "member" && (
                      <span className="text-xs bg-[#22232A] text-[#9CA3AF] px-2 py-1 rounded-full">
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
                    className="text-[#9CA3AF] hover:text-white text-lg"
                  >
                    ⋮
                  </button>

                  {openMenu === member.user_id && (

                    <div
                      ref={menuRef}
                      className="absolute right-0 mt-2 w-44 z-20
                      bg-[#111217] border border-[#22232A] rounded-lg overflow-hidden"
                    >

                      {isCreator && !isCreatorMember && (

                        member.role === "admin" ? (

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateRole(member.user_id, "member");
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-[#E5E7EB] hover:bg-[#1A1B21]"
                          >
                            Demote to Member
                          </button>

                        ) : (

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateRole(member.user_id, "admin");
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-[#E5E7EB] hover:bg-[#1A1B21]"
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
                          className="block w-full text-left px-4 py-2 text-red-400 hover:bg-[#1A1B21]"
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

    </div>

  );

}

export default MemberList;