import { onBeforeUnmount, ref } from "vue";
import { JwtService } from "@/services/JwtService";
export const useConnectionWS = () => {
  const connection = ref();
  try {
    connection.value = new WebSocket(
      `${
        import.meta.env.VITE_WEBSOCKET_BASE_URL
      }ws/user-connection-disconnection/?token=${JwtService.getToken()}`
    );
    connection.value.onmessage = (event) => {
      const data = JSON.parse(event.data);
    };
  } catch (error) {
    console.log("wss", error);
  }
  onBeforeUnmount(() => {
    connection.value?.close();
  });
  return { connection };
};
//# sourceMappingURL=useConnectionWS.js.map
