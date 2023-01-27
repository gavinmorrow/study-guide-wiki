(async () => {
    const host = "http://localhost:8080";
    const sleep = sec =>
        new Promise(resolve => setTimeout(resolve, sec * 1000));

    //=================================================================\\

    // Ensure that the /protected doesn't give access if unauthenticated
    await fetch(`${host}/protected`).then(res => {
        if (res.ok) {
            throw new Error("Expected fail. HTTP status code:", res.status);
        }
    });

    //=================================================================\\

    // Signup
    const signupRes = await fetch(`${host}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: "12345" }),
    });

    if (!signupRes.ok) {
        throw new Error("Signup failed. HTTP status code:", res.status);
    }

    const { id, password } = await signupRes.json();

    //=================================================================\\

    // Login
    const loginRes = await fetch(`${host}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password }),
    });

    if (!loginRes.ok) {
        throw new Error("Login failed. HTTP status code:", loginRes.status);
    }

    const { accessToken, refreshToken } = await loginRes.json();

    //=================================================================\\

    // Ensure that the /protected gives access if authenticated
    await fetch(`${host}/protected`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    }).then(res => {
        if (!res.ok) {
            throw new Error("Expected ok. HTTP status code:", res.status);
        }
    });

    //=================================================================\\

    // Ensure that the /protected doesn't give access if the access token is expired
    await sleep(15);
    await fetch(`${host}/protected`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    }).then(res => {
        if (res.ok) {
            throw new Error("Expected 403");
        }
    });

    //=================================================================\\

    // Refresh the access token
    const refreshRes = await fetch(`${host}/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
    });

    if (!refreshRes.ok) {
        throw new Error("Refresh failed. HTTP status code:", refreshRes.status);
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await refreshRes.json();

    //=================================================================\\

    // Ensure that the /protected gives access if authenticated
    await fetch(`${host}/protected`, {
        headers: { Authorization: `Bearer ${newAccessToken}` },
    }).then(res => {
        if (!res.ok) {
            throw new Error("Expected ok. HTTP status code:", res.status);
        }
    });

    //=================================================================\\

    // Try to refresh with an old refresh token (invalid b/c it was already used)
    const refreshWithOldRes = await fetch(`${host}/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
    });

    if (refreshWithOldRes.ok) {
        throw new Error(
            "Refresh with old token should fail. HTTP status code:",
            refreshWithOldRes.status
        );
    }

    //=================================================================\\

    // Try to refresh with the new refresh token (invalid b/c of family)
    const refreshWithNewRes = await fetch(`${host}/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: newRefreshToken }),
    });

    if (refreshWithNewRes.ok) {
        throw new Error(
            "Refresh with new token should fail. HTTP status code:",
            refreshWithNewRes.status
        );
    }

    //=================================================================\\

    console.log("🎉 All tests passed! :)");
})();
