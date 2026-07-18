import { DisplayProvider } from "@/components/display/DisplayContext";
import OrdersTvPage from "@/components/orders/tv/OrdersTvPage";

export default function Page() {
  return (
    <DisplayProvider>
      <OrdersTvPage />
    </DisplayProvider>
  );
}