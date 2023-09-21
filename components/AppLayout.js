import React from "react";
import propTypes from "prop-types";
import Link from "next/link";

const AppLayout = ({ children }) => {
  return (
    <div>
      <div>
        <Link href="/" legacyBehavior>
          <a>노드버드</a>
        </Link>
        <Link href="/profile" legacyBehavior>
          <a>프로필</a>
        </Link>
        <Link href="/signup" legacyBehavior>
          <a>회원가입</a>
        </Link>
      </div>
      {children}
    </div>
  );
};

AppLayout.propTypes = {
  children: propTypes.node.isRequired,
};

export default AppLayout;
