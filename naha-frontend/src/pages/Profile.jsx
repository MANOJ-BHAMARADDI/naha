import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold">Profile</h2>
        <p className="text-gray-600">Name: {user?.name}</p>
        <p className="text-gray-600">Email: {user?.email}</p>
        <button onClick={logout} className="bg-red-500 text-white p-2 rounded-md mt-4">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
