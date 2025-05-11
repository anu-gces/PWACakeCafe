import { DataTable } from "@/components/ui/dataTable_billing";
import { createLazyFileRoute, useLoaderData } from "@tanstack/react-router";
import { columns } from "@/components/restaurant_mobile/billing";

// const orders = [
//   {
//     orderId: "order123",
//     discountRate: 0.1,
//     taxRate: 0.13,
//     items: [
//       { foodName: "Waffle Cone", quantity: 2, price: 5 },
//       { foodName: "Blueberry Cheesecake", quantity: 1, price: 6 },
//     ],
//     totalAmount: 15.7,
//     orderDate: "2025-05-06T12:00:00Z",
//     processedBy: { name: "John Doe" },
//   },
//   {
//     orderId: "order456",
//     discountRate: 0.15,
//     taxRate: 0.1,
//     items: [
//       { foodName: "Pasta", quantity: 1, price: 8 },
//       { foodName: "Garlic Bread", quantity: 2, price: 4 },
//     ],
//     totalAmount: 18.2,
//     orderDate: "2025-05-06T14:00:00Z",
//     processedBy: { name: "Jane Smith" },
//   },
// ];

export const Route = createLazyFileRoute("/home/billing")({
  component: () => {
    const rawOrders = useLoaderData({ from: "/home/billing" });

    const orders = rawOrders.map((order) => {
      const subTotalAmount = order.items.reduce((sum, item) => sum + item.foodPrice * item.qty, 0);
      const discountAmount = subTotalAmount * (order.discountRate / 100);
      const taxAmount = (subTotalAmount - discountAmount) * (order.taxRate / 100);
      const totalAmount = subTotalAmount - discountAmount + taxAmount;

      return {
        ...order,
        subTotalAmount, // Add the total to the order object
        totalAmount,
      };
    });

    return (
      <>
        <DataTable
          columns={columns}
          data={orders || []}
          filterColumnId="receiptDate"
          visibleColumns={["receiptId", "totalAmount", "receiptDate", "processedBy"]}
        />
      </>
    );
  },
});
