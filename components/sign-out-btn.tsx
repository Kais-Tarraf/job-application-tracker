"use client";
import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { signOut } from "@/lib/auth/auth-client";

const SignOut = () => {
	const router = useRouter();
	return (
		<DropdownMenuItem
			onClick={async () => {
				const result = await signOut();
				if (result.data) {
					router.push("/sign-in");
				} else {
					alert("Error signing out");
				}
			}}
		>
			Log Out
		</DropdownMenuItem>
	);
};

export default SignOut;
