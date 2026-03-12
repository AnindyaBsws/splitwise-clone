function getCurrentUserId() {

  const token = localStorage.getItem("token");

  if (!token) return null;

  try {

    const payload = JSON.parse(atob(token.split(".")[1]));

    const now = Date.now() / 1000;

    if (payload.exp && payload.exp < now) {
      localStorage.removeItem("token");
      return null;
    }

    return Number(payload.sub);

  } catch {

    return null;

  }

}

export default getCurrentUserId;