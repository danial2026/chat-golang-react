import React, { useEffect, useState } from "react";

function LoginPage({ match }) {
  useEffect(() => {
    // Get the query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const redirectParam = urlParams.get("token");

    // TODO : check if init url is `https://auth.danials.space`

    if (redirectParam) {
      // Save user's accessToken
      localStorage.setItem('accessToken', redirectParam);

      // Redirect to main page if user is not logged in
      window.location.href = '/';
    } else {
      // Redirect to main page if user is not logged in
      window.location.href = "/";
    }
  }, []);

  return <div></div>;
}

export default LoginPage;