import { createFileRoute } from "@tanstack/react-router";
import { getAllOrders } from "@/firebase/firestore";
import { queryOptions } from "@tanstack/react-query";

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
});

export const getAllOrdersQueryOptions = () =>
  queryOptions({
    queryKey: ["getAllOrders"],
    queryFn: getAllOrders,
    placeholderData: [],
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  });
