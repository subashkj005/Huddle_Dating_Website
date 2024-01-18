import React, { createContext, useState } from "react";

export const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(false);

  // User Loader
  const showLoading = () => {
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
  };

  // Admin loader
  const showAdminLoading = () => {
    setIsAdminLoading(true);
  };

  const hideAdminLoading = () => {
    setIsAdminLoading(false);
  };

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        isAdminLoading,
        showLoading,
        hideLoading,
        showAdminLoading,
        hideAdminLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};
