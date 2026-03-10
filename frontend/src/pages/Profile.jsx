import useAuth from "../hooks/useAuth";

function Profile() {

  const { token } = useAuth();

  let name = "User";
  let email = "";

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      name = payload.name || "User";
      email = payload.email || "";
    } catch (error) {
      console.error("Token decode failed:", error);
    }
  }

  return (

    <div className="max-w-2xl mx-auto bg-white border rounded-xl shadow-sm p-6">

      <h1 className="text-2xl font-bold mb-6">
        Profile
      </h1>

      <div className="space-y-4">

        <div>
          <p className="text-gray-500 text-sm">Name</p>
          <p className="text-lg font-medium">{name}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Email</p>
          <p className="text-lg font-medium">{email || "Not available"}</p>
        </div>

      </div>

    </div>

  );

}

export default Profile;