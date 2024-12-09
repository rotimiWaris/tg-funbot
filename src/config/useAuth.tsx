import { useEffect, useCallback } from "react";
import supabase from "./supabaseClient";
import { useUserStore } from "./userStore";
import { AuthUser } from "./AuthUser";
import { useLaunchParams } from "@telegram-apps/sdk-react";

const useAuth = () => {
  const lp = useLaunchParams();
  const setUser = useUserStore((state) => state.setUser);
  const setIsNewUser = useUserStore((state) => state.setIsNewUser);
  const existingUserInState = useUserStore((state) => state.user);

  const signUpUser = useCallback(async () => {
    const initDataResult = lp.initData;
    const user = initDataResult?.user as AuthUser | undefined;

    if (user) {
      if (existingUserInState && existingUserInState.id === user.id) {
        console.log("User already exists in state, skipping refetch");
        return;
      }

      try {
        const { data: existingUser, error: fetchError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (fetchError) {
          console.error("Error fetching user:", fetchError);
          return;
        }

        if (!existingUser) {
          setIsNewUser(true);

          const { data, error } = await supabase
            .from("users")
            .insert([
              {
                ...user,
                high_score: 0,
              },
            ])
            .select()
            .single();

          if (error) {
            console.error("Error inserting user:", error);
          } else {
            console.log("User signed up:", data);
            setUser(data);
          }
        } else {
          console.log("User already exists:", existingUser);
          setUser(existingUser);
          setIsNewUser(false);
        }
      } catch (error) {
        console.error("Error during user signup process:", error);
      }
    }
  }, [lp, setUser, setIsNewUser, existingUserInState]);

  useEffect(() => {
    signUpUser();
  }, [signUpUser]);

  return { user: existingUserInState };
};

export default useAuth;
