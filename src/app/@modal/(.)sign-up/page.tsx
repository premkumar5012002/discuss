"use client";

import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { Modal, ModalBody, ModalContent } from "@nextui-org/react";

import { SignUp } from "@/components/auth/sign-up";

const Page: NextPage = () => {
  const router = useRouter();

  const onModalClose = () => {
    router.back();
  };

  return (
    <Modal isOpen={true} onOpenChange={onModalClose}>
      <ModalContent>
        <ModalBody className="py-10">
          <SignUp />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default Page;
