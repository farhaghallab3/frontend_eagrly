
export const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    // JWT structure => header.payload.signature
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));

    // Django JWT عادة بيكون فيه user_id أو id
    return decodedPayload.user_id || decodedPayload.id || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
