import { columns } from "@/components/employee";
import { DataTable } from "@/components/ui/dataTable";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { getAllUsers, getCurrentUserDocumentDetails } from "@/firebase/firestore";

import { useLoadingSpinner } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

// const dummyUsers: any = [
// 	{
// 		uid: "1",
// 		email: "john.doe@example.com",
// 		photoURL: null,
// 		firstName: "John",
// 		lastName: "Doe",
// 		phoneNumber: "123-456-7890",
// 		department: "Sales",
// 		role: "admin",
// 		isProfileComplete: true,
// 	},

// ];

export const Route = createFileRoute("/home/employee")({
  component: () => {
    const {
      data: users,
      isLoading,
      error,
    } = useQuery({
      queryKey: ["usersManagement"],
      queryFn: getAllUsers,
      staleTime: Number.POSITIVE_INFINITY,
      gcTime: Number.POSITIVE_INFINITY,
    });

    useLoadingSpinner(isLoading);
    if (error) return <div>Error occurred</div>;

    // Use the user data in your component
    return (
      <>
        <DataTable
          columns={columns}
          data={users || []}
          filterColumnId="firstName"
          visibleColumns={["actions", "firstName", "phoneNumber"]}
        />
      </>
    );
  },
  beforeLoad: async () => {
    const user = await getCurrentUserDocumentDetails();

    // Check if the user's role is owner or admin
    if (user!.role !== "owner" && user!.role !== "admin") {
      // If the user is not an owner or admin, navigate to the home page
      throw redirect({
        to: "/home/welcome",
      });
    }
  },
});
