import React from "react";
import { Link } from "react-router-dom";

function ReportList() {
  return (
    <>
      <Link to='/admin/reports/posts'>
        <div className="px-16 py-8 bg-slate-200 hover:bg-slate-300 border max-w-[18rem] rounded text-lg font-sans font-bold text-center">
          Post Reports
        </div>
      </Link>
    </>
  );
}

export default ReportList;
