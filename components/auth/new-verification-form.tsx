"use client";

import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { useRouter, useSearchParams } from "next/navigation";

import { newVerification } from "@/actions/new-verification";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

const TIME_FOR_REDIRECT_IN_SECONDS = 10;

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError("Missing token!");
      return;
    }

    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
        setTimeout(() => {
          router.push("/auth/login");
        }, TIME_FOR_REDIRECT_IN_SECONDS * 100);
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token, success, error, router]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && <BeatLoader />}
        {!success && <FormError message={error} />}
        {success && (
          <div className="flex flex-col gap-2">
            <FormSuccess message={success} />
            <p className="text-center text-sm text-muted-foreground">
              You will be redirected to login in {TIME_FOR_REDIRECT_IN_SECONDS}
              seconds. Then you can log in.
            </p>
          </div>
        )}
      </div>
    </CardWrapper>
  );
};
