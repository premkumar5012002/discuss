import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const usePremadeToast = () => {
  const router = useRouter();

  const loginToast = () => {
    toast.error("Login required.", {
      description: "You need to be logged in to do that.",
      action: {
        label: "Sign in",
        onClick: () => router.push("/sign-in"),
      },
    });
  };

  return { loginToast };
};
