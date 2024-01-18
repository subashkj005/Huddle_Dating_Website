import React, { useContext } from "react";
import HashLoader from "react-spinners/HashLoader";
import { LoadingContext } from "../../context/LoadingContext";

function HashLoadingScreen() {
  const { isLoading, isAdminLoading } = useContext(LoadingContext);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <HashLoader color="#fc449a" size={80} />
      </div>
    );
  }

  if (isAdminLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <HashLoader color="#3156d2" size={80} />
      </div>
    );
  }
}

export default HashLoadingScreen;
