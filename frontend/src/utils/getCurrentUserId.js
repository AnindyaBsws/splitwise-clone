function getCurrentUserId() {

  const token = localStorage.getItem("token");

  if (!token) return null;

  try {

    const payload = JSON.parse(atob(token.split(".")[1]));

    return Number(payload.sub);

  } catch {

    return null;

  }

}

export default getCurrentUserId;