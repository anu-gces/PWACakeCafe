import { DataTable } from "@/components/ui/dataTable_billing";
import { createFileRoute } from "@tanstack/react-router";
import { columns } from "@/components/restaurant_mobile/billing";
import { getAllOrders } from "@/firebase/firestore";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

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

export const Route = createFileRoute("/home/billing")({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(getAllOrdersQueryOptions()),

  component: () => {
    const { data: rawOrders } = useSuspenseQuery({
      queryKey: ["getAllOrders"], // Use the same query key
      queryFn: getAllOrders, // Use the same query function
    });

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

export const getAllOrdersQueryOptions = () =>
  queryOptions({
    queryKey: ["getAllOrders"],
    queryFn: getAllOrders,
    placeholderData: [],
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  });
