(async () => {
    const host = "http://localhost:8080";
    const sleep = sec =>
        new Promise(resolve => setTimeout(resolve, sec * 1000));

    // Spawn the server
    console.log("Spawning server…");
    const { exec, spawn } = require("child_process");

    // Shut down old containers if they exist, and clear the data
    await exec("docker compose down -v");

    // Start the containers
    const container = await spawn("docker", ["compose", "up"]);
    container.stdout.on("data", data => {
        const string = data.toString();
        process.stdout.write(`\x1b[32m${string}\x1b[89m\x1b[0m\x1b[0m`);
    });

    try {
        // Wait for the server to start
        console.log("Waiting for server to start…");
        while (
            await fetch(`${host}/`)
                .then(res => !res.ok)
                .catch(err => true)
        ) {
            sleep(1);
        }

        // Start tests
        console.log("Starting tests…");

        //=================================================================\\

        // Ensure that the /protected doesn't give access if unauthenticated
        await fetch(`${host}/protected`).then(res => {
            if (res.ok) {
                throw new Error(
                    `Expected fail. HTTP status code: ${res.status}`
                );
            }
        });

        //=================================================================\\

        // Signup
        const password = "123456";
        const signupRes = await fetch(`${host}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                password: password,
                displayName: "Example123",
            }),
        });

        if (!signupRes.ok) {
            throw new Error(
                `Signup failed. HTTP status code: ${signupRes.status}`
            );
        }

        const { id } = await signupRes.json();

        //=================================================================\\

        // Login
        const loginRes = await fetch(`${host}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, password }),
        });

        if (!loginRes.ok) {
            throw new Error(
                `Login failed. HTTP status code: ${loginRes.status}`
            );
        }

        const { accessToken, refreshToken } = await loginRes.json();

        //=================================================================\\

        // Ensure that the /protected gives access if authenticated
        await fetch(`${host}/protected`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        }).then(res => {
            if (!res.ok) {
                throw new Error(`Expected ok. HTTP status code: ${res.status}`);
            }
        });

        //=================================================================\\

        // Ensure that the /protected doesn't give access if the access token is expired
        await sleep(15);
        await fetch(`${host}/protected`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        }).then(res => {
            if (res.ok) {
                throw new Error(
                    `Expected fail. HTTP status code: ${res.status}`
                );
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
            throw new Error(
                `Refresh failed. HTTP status code: ${refreshRes.status}`
            );
        }

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            await refreshRes.json();

        //=================================================================\\

        // Ensure that the /protected gives access if authenticated
        await fetch(`${host}/protected`, {
            headers: { Authorization: `Bearer ${newAccessToken}` },
        }).then(res => {
            if (!res.ok) {
                throw new Error(`Expected ok. HTTP status code: ${res.status}`);
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
                `Refresh with old token should fail. HTTP status code: ${refreshWithOldRes.status}`
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
                `Refresh with new token should fail. HTTP status code: ${refreshWithNewRes.status}`
            );
        }

        //=================================================================\\

        console.log("🎉 All tests passed! :)");
    } catch (err) {
        console.error(err);
        console.error("❌ Tests failed! :(");
    } finally {
        console.log("Shutting down server…");
        await exec("docker compose down -v");
        container.kill();
    }
})();
