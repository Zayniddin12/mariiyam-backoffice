const ID_TOKEN_KEY = "id_token";
const REFRESH_KEY = "refresh";
export class JwtService {
  static getToken = () => {
    return window.localStorage.getItem(ID_TOKEN_KEY);
  };
  static getRefresh = () => {
    return window.localStorage.getItem(REFRESH_KEY);
  };
  static saveToken = (token) => {
    window.localStorage.setItem(ID_TOKEN_KEY, token);
  };
  static saveRefreshToken = (token) => {
    window.localStorage.setItem(REFRESH_KEY, token);
  };
  static destroyAccess = () => {
    window.localStorage.removeItem(ID_TOKEN_KEY);
  };
  static destroyRefresh = () => {
    window.localStorage.removeItem(REFRESH_KEY);
  };
}
//# sourceMappingURL=JwtService.js.map
