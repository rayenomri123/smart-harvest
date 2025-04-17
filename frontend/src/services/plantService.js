export async function deletePlant(id_plant) {
    try {
      const response = await fetch("http://localhost:3500/api/plants/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
        body: JSON.stringify({
          id_plant:id_plant
        }),
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

export async function changeMode(id_plant,mode=0,p=0) {
    try {
      const response = await fetch("http://localhost:3500/api/plants/change_mode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
        body: JSON.stringify({
          id_plant:id_plant,
          mode:mode,
          p:p
        }),
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

export async function getHistory(id_plant,detector) {
  try {
    const response = await fetch(`http://localhost:3500/api/plants/history`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      credentials: 'include',
      body: JSON.stringify({
        id_plant:id_plant,
        detector:detector,
      }), 
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Token refresh error:", error);
    return false;
  }
}

