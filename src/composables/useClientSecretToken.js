export const useClientSecret = () => {
  const secretId = localStorage.getItem("client_secret_id");
  function generateRandomHexString(length) {
    const byteCount = Math.ceil(length / 2);
    const randomBytes = new Uint8Array(byteCount);
    crypto.getRandomValues(randomBytes);
    let hexString = "";
    for (let i = 0; i < byteCount; i++) {
      hexString += randomBytes[i].toString(16).padStart(2, "0");
    }
    return hexString.substr(0, length);
  }
  const randomHex = generateRandomHexString(16);
  function init() {
    if (!secretId) {
      localStorage.setItem("client_secret_id", randomHex);
    }
  }
  return { randomHex, init, secretId };
};
//# sourceMappingURL=useClientSecretToken.js.map
