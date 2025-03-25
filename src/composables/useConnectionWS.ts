import { onBeforeUnmount, ref } from "vue";
import { JwtService } from "@/services/JwtService";
export const useConnectionWS = () => {
  const connection = ref<WebSocket>();

  try {
    connection.value = new WebSocket(
      `${
        import.meta.env.VITE_WEBSOCKET_BASE_URL
      }ws/user-connection-disconnection/?token=${JwtService.getToken()}`
    );
    connection.value.onmessage = (event) => {
      const data = JSON.parse(event.data);
    };
  } catch (error: any) {
    console.log("wss", error);
  }

  onBeforeUnmount(() => {
    connection.value?.close();
  });

  return { connection };
};
