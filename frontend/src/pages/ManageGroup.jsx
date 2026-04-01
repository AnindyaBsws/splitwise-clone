return (

  <div className="page-container space-y-12 fade-in">

    {/* HEADER */}
    <h1 className="text-3xl font-bold">
      Manage Group
    </h1>

    {/* MEMBERS */}
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Members</h2>

      <MemberList
        members={members}
        groupInfo={groupInfo}
        currentUserId={currentUserId}
        groupId={id}
        openRemoveModal={openRemoveModal}
        fetchMembers={fetchMembers}
      />
    </div>

    {/* ADD MEMBER */}
    {(isCreator || isAdmin) && (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Add Member</h2>

        <div className="glass-card p-6">
          <AddMember
            groupId={id}
            fetchMembers={fetchMembers}
          />
        </div>
      </div>
    )}

    {/* INVITE */}
    {(isCreator || isAdmin) && (

      <div className="glass-card p-6 space-y-4">

        <h2 className="text-lg font-semibold">
          Invite Others
        </h2>

        <div className="flex flex-wrap gap-3">

          <button
            onClick={copyInviteLink}
            className="gradient-btn"
          >
            Copy Link
          </button>

          <button
            onClick={shareWhatsApp}
            className="px-4 py-2 rounded-xl text-sm bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 transition"
          >
            WhatsApp
          </button>

          <button
            onClick={shareEmail}
            className="px-4 py-2 rounded-xl text-sm bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            Email
          </button>

        </div>

      </div>

    )}

    {/* DANGER ZONE */}
    <div className="glass-card p-6 border border-red-500/30 space-y-4">

      <h2 className="text-lg font-semibold text-red-400">
        Danger Zone
      </h2>

      <div className="flex flex-col sm:flex-row gap-3">

        <button
          onClick={handleLeaveGroup}
          className="px-4 py-2 rounded-xl text-sm bg-white/5 border border-white/10 hover:bg-white/10 transition"
        >
          Leave Group
        </button>

        {isCreator && (

          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition"
          >
            Delete Group
          </button>

        )}

      </div>

    </div>

    {/* MODALS */}
    <RemoveMemberModal
      showRemoveModal={showRemoveModal}
      setShowRemoveModal={setShowRemoveModal}
      memberDetails={memberDetails}
      selectedMember={selectedMember}
      deleteMember={deleteMember}
    />

    <DeleteGroupModal
      showDeleteModal={showDeleteModal}
      setShowDeleteModal={setShowDeleteModal}
      confirmDeleteGroup={confirmDeleteGroup}
      deleteError={deleteError}
    />

  </div>

);