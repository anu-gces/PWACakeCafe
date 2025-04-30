import { doSignOut } from "@/firebase/auth";
import { uploadProfilePicture } from "@/firebase/firebase_storage";
import {
	completeProfileInformation,
	getCurrentUserDetails,
} from "@/firebase/firestore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useFormik } from "formik";
import type React from "react";
import { useRef } from "react";
import { toast } from "sonner";
import * as yup from "yup";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera, User2, X } from "lucide-react";
import { ModeToggle } from "./ui/themeToggle";

// Define the Yup validation schema
const schema = yup.object({
	firstName: yup
		.string()
		.required("First Name is required")
		.matches(/^\S*$/, "No spaces are allowed"),
	lastName: yup
		.string()
		.required("Last Name is required")
		.matches(/^\S*$/, "No spaces are allowed"),
	phoneNumber: yup
		.string()
		.required("Phone Number is required")
		.matches(/^98\d{8}$/, "Invalid phone number"),
	department: yup.string().required("Department is required"),
	profilePicture: yup.mixed().notRequired(),
});

export function profileComplete() {
	const navigate = useNavigate({ from: "/profileComplete" });

	const {
		data: user,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["user"],
		queryFn: getCurrentUserDetails,
		staleTime: Number.POSITIVE_INFINITY, // Data will never go stale
		gcTime: Number.POSITIVE_INFINITY, //
	});

	const mutation = useMutation({
		mutationFn: async (values: any) => {
			let downloadURL = "";
			if (values.profilePicture) {
				downloadURL = await uploadProfilePicture(
					user!.uid,
					values.profilePicture,
				);
				values.profilePicture = downloadURL;
			}
			await completeProfileInformation(user!.uid, values);
		},
		onSuccess: () => {
			toast.success("Profile updated successfully!");
			navigate({ to: "/home" });
		},
		onError: (error: any) => {
			toast.error(error.message);
		},
	});

	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			formik.setFieldValue("profilePicture", file);
		}
	};

	// Initialize Formik
	const formik = useFormik({
		initialValues: {
			firstName: "",
			lastName: "",
			phoneNumber: "",
			department: "",
			profilePicture: null,
		},
		validationSchema: schema,
		onSubmit: (values) => {
			// console.log(values);
			mutation.mutate(values);
		},
	});

	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="absolute top-0 right-0 p-12">
				<ModeToggle />
			</div>
			<Card className=" mx-auto max-w-md">
				<form onSubmit={formik.handleSubmit}>
					<CardHeader>
						<CardTitle>Complete Your Profile</CardTitle>
						<CardDescription>
							Provide a few more details to finish setting up your account.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex justify-center">
							<div className="relative group">
								<input
									type="file"
									accept="image/*"
									onChange={handleImageUpload}
									className="hidden"
									ref={fileInputRef}
								/>
								<Avatar className="h-20 w-20 cursor-pointer">
									{isLoading ? (
										<div className="h-20 w-20 flex items-center justify-center">
											<Skeleton className="h-20 w-20 rounded-full" />
										</div>
									) : error ? (
										<div className="h-20 w-20 flex items-center justify-center">
											Error
										</div>
									) : (
										<>
											<AvatarImage
												alt="Profile Picture"
												src={
													formik.values.profilePicture
														? URL.createObjectURL(formik.values.profilePicture)
														: user?.photoURL!
												}
											/>
											<AvatarFallback>
												<User2 />
											</AvatarFallback>
										</>
									)}
								</Avatar>
								{formik.values.profilePicture && (
									<button
										className="absolute top-0 right-0 -mt-2 -mr-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center"
										onClick={() => formik.setFieldValue("profilePicture", null)}
									>
										<X color="white" className="h-4 w-4" />
									</button>
								)}
								<div
									onClick={() => fileInputRef.current?.click()}
									className="cursor-pointer absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
								>
									<Camera color="white" className="h-6 w-6 text-white" />
								</div>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="first-name">First Name</Label>
								<Input
									id="first-name"
									name="firstName"
									placeholder="John"
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.firstName}
								/>
								{formik.touched.firstName && formik.errors.firstName ? (
									<div className="text-red-500">{formik.errors.firstName}</div>
								) : null}
							</div>
							<div className="space-y-2">
								<Label htmlFor="last-name">Last Name</Label>
								<Input
									id="last-name"
									name="lastName"
									placeholder="Doe"
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.lastName}
								/>
								{formik.touched.lastName && formik.errors.lastName ? (
									<div className="text-red-500">{formik.errors.lastName}</div>
								) : null}
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="phoneNumber">Phone Number</Label>
							<Input
								id="phoneNumber"
								name="phoneNumber"
								placeholder="+977 9812345678"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.phoneNumber}
							/>
							{formik.touched.phoneNumber && formik.errors.phoneNumber ? (
								<div className="text-red-500">{formik.errors.phoneNumber}</div>
							) : null}
						</div>
						<div className="space-y-2">
							<div className="font-semibold text-sm">Department</div>
							<Select
								value={formik.values.department}
								onValueChange={(value) =>
									formik.setFieldValue("department", value)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select Department" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="kitchen">Kitchen</SelectItem>
									<SelectItem value="guest_relations">
										Guest Relations
									</SelectItem>
									<SelectItem value="operations">Operations</SelectItem>
									<SelectItem value="management">Management</SelectItem>
								</SelectContent>
							</Select>
							{formik.touched.department && formik.errors.department ? (
								<div className="text-red-500">{formik.errors.department}</div>
							) : null}
						</div>
					</CardContent>
					<CardFooter>
						<Button
							type="button"
							onClick={async () => {
								try {
									const signOutSuccessful = await doSignOut();
									if (signOutSuccessful) {
										navigate({ to: "/" });
									}
								} catch (error: unknown) {
									if (error instanceof Error) {
										toast(`Error signing out: ${error.message}`);
									} else {
										toast(`Error signing out: ${error}`);
									}
								}
							}}
						>
							Logout
						</Button>

						<Button type="submit" className="ml-auto">
							Finish
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
