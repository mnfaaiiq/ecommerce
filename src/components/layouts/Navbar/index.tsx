import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

const Navbar = () => {
  const { data } = useSession();
  return (
    <div className="bg-black flex items-center justify-end w-full h-16 text-white p-5">
      <button
        className="bg-white py-3 px-4 cursor-pointer text-black rounded-lg"
        onClick={() => (data ? signOut() : signIn())}
      >
        {data ? "Logout" : "Login"}
      </button>
    </div>
  );
};

export default Navbar;
