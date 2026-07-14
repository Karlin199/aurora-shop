import OrderCard from "./OrderCard";

type Props = {
  orders: any[];
  selectedOrder: any;
  onSelect: (order: any) => void;
};

export default function OrdersList({
  orders,
  selectedOrder,
  onSelect,
}: Props) {
  return (
    <div className="space-y-4">

      {orders.map((order, index) => (

        <OrderCard
          key={index}
          order={order}
          selected={selectedOrder === order}
          onClick={() => onSelect(order)}
        />

      ))}

    </div>
  );
}