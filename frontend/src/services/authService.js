export async function get_sensors() {
  try {
    const response = await fetch("http://localhost:3500/api/plants/all_sensors", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Token refresh error:", error);
    return false;
  }
}

export async function refreshToken() {
  try {
    const response = await fetch("http://localhost:3500/api/refresh", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.status === 403) {
      return false;
    }

    if (!response.ok) {
      throw new Error(`HTTP error during refresh: ${response.status}`);
    }

    const data = await response.json();
    localStorage.setItem("token", data.accessToken);
    return true;
  } catch (error) {
    console.error("Token refresh error:", error);
    return false;
  }
}

export async function logout() {
  try {
    const response = await fetch("http://localhost:3500/api/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }
    
    localStorage.removeItem("token");
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
}

export async function auth_test() {
  try {
    if(localStorage.getItem("token")==null){
      return false
    }
    const testResponse = await fetch("http://localhost:3500/api/test", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      credentials: "include",
    });

    if (testResponse.status === 403) {
      const refreshSuccess = await refreshToken();
      
      if (refreshSuccess) {
        const retryResponse = await fetch("http://localhost:3500/api/test", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        });

        if (!retryResponse.ok) {
          throw new Error(`HTTP error after refresh: ${retryResponse.status}`);
        }

        const retryData = await retryResponse.json();
        return retryData === "ok";
      } else {
        await logout();
        return false;
      }
    }

    if (!testResponse.ok) {
      throw new Error(`HTTP error: ${testResponse.status}`);
    }

    const testData = await testResponse.json();
    return testData === "ok";
  } catch (error) {
    console.error("Auth test error:", error);
    return false;
  }
}

// authService.js
export async function getCurrentUser() {
  try {
    // Initial request
    let response = await fetch("http://localhost:3500/api/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      credentials: "include",
    });

    // Handle token expiration
    if (response.status === 403) {
      const refreshSuccess = await refreshToken();
      if (!refreshSuccess) {
        await logout();
        return null;
      }
      
      // Retry with new token
      response = await fetch("http://localhost:3500/api/users/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      });
    }

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}