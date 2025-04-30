import { createFileRoute, redirect } from "@tanstack/react-router";
import { columns } from "@/components/employee";
import { DataTable } from "@/components/ui/dataTable";

import { getAllUsers, getCurrentUserDocumentDetails } from "@/firebase/firestore";

import { useQuery } from "@tanstack/react-query";
import { useLoadingSpinner } from "@/lib/utils";

const dummyUsers: any = [
  {
    uid: "1",
    email: "john.doe@example.com",
    photoURL: null,
    firstName: "John",
    lastName: "Doe",
    phoneNumber: "123-456-7890",
    department: "Sales",
    role: "admin",
    isProfileComplete: true,
  },
  {
    uid: "2",
    email: "jane.smith@example.com",
    photoURL: "https://example.com/photo.jpg",
    firstName: "Jane",
    lastName: "Smith",
    phoneNumber: "987-654-3210",
    department: "Marketing",
    role: "owner",
    isProfileComplete: true,
  },
  {
    uid: "3",
    email: "bob.johnson@example.com",
    photoURL: null,
    firstName: "Bob",
    lastName: "Johnson",
    phoneNumber: "555-555-5555",
    department: "HR",
    role: "employee",
    isProfileComplete: false,
  },
  {
    uid: "3",
    email: "bob.johnson@example.com",
    photoURL: null,
    firstName: "Bob",
    lastName: "Johnson",
    phoneNumber: "555-555-5555",
    department: "HR",
    role: "employee",
    isProfileComplete: false,
  },
  {
    uid: "3",
    email: "bob.johnson@example.com",
    photoURL: null,
    firstName: "Bob",
    lastName: "Johnson",
    phoneNumber: "555-555-5555",
    department: "HR",
    role: "employee",
    isProfileComplete: false,
  },
  {
    uid: "3",
    email: "bob.johnson@example.com",
    photoURL: null,
    firstName: "Bob",
    lastName: "Johnson",
    phoneNumber: "555-555-5555",
    department: "HR",
    role: "employee",
    isProfileComplete: false,
  },
  {
    uid: "3",
    email: "bob.johnson@example.com",
    photoURL: null,
    firstName: "Bob",
    lastName: "Johnson",
    phoneNumber: "555-555-5555",
    department: "HR",
    role: "employee",
    isProfileComplete: false,
  },
  {
    uid: "3",
    email: "bob.johnson@example.com",
    photoURL: null,
    firstName: "Bob",
    lastName: "Johnson",
    phoneNumber: "555-555-5555",
    department: "HR",
    role: "employee",
    isProfileComplete: false,
  },
  {
    uid: "3",
    email: "bob.johnson@example.com",
    photoURL: null,
    firstName: "Bob",
    lastName: "Johnson",
    phoneNumber: "555-555-5555",
    department: "HR",
    role: "employee",
    isProfileComplete: false,
  },
  {
    uid: "3",
    email: "bob.johnson@example.com",
    photoURL: null,
    firstName: "Bob",
    lastName: "Johnson",
    phoneNumber: "555-555-5555",
    department: "HR",
    role: "employee",
    isProfileComplete: false,
  },
  {
    uid: "3",
    email: "bob.johnson@example.com",
    photoURL: null,
    firstName: "Bob",
    lastName: "Johnson",
    phoneNumber: "555-555-5555",
    department: "HR",
    role: "employee",
    isProfileComplete: false,
  },
  {
    uid: "3",
    email: "bob.johnson@example.com",
    photoURL: null,
    firstName: "Bob",
    lastName: "Johnson",
    phoneNumber: "555-555-5555",
    department: "HR",
    role: "employee",
    isProfileComplete: false,
  },
  {
    uid: "3",
    email: "bob.johnson@example.com",
    photoURL: null,
    firstName: "Bob",
    lastName: "Johnson",
    phoneNumber: "555-555-5555",
    department: "HR",
    role: "employee",
    isProfileComplete: false,
  },
  {
    uid: "3",
    email: "bob.johnson@example.com",
    photoURL: null,
    firstName: "Bob",
    lastName: "Johnson",
    phoneNumber: "555-555-5555",
    department: "HR",
    role: "employee",
    isProfileComplete: false,
  },
  {
    uid: "3",
    email: "bob.johnson@example.com",
    photoURL: null,
    firstName: "Bob",
    lastName: "Johnson",
    phoneNumber: "555-555-5555",
    department: "HR",
    role: "employee",
    isProfileComplete: false,
  },
];

export const Route = createFileRoute("/home/employee")({
  component: () => {
    const {
      data: users,
      isLoading,
      error,
    } = useQuery({
      queryKey: ["usersManagement"],
      queryFn: getAllUsers,
      staleTime: Infinity,
      gcTime: Infinity,
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
