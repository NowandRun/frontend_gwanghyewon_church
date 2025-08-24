import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/"); // 3초 후 홈으로 이동
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "5rem" }}>
      <h1>404</h1>
      <p>페이지를 찾을 수 없습니다. 3초 후 홈으로 이동합니다.</p>
    </div>
  );
}

export default NotFound;
