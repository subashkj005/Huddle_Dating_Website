import React from "react";
import BasicNavbar from "../navbar/BasicNavbar";
import ContentArea from "../matchingSidebar/ContentArea";

function Layout() {
  return (
    <>
      {/* Navbar */}
      <BasicNavbar />
      {/* Portion below Navbar */}
      <ContentArea />
    </>
  );
}

export default Layout;
