import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Button from "./button";
import IconButton from "./icon-button";

interface AppDialogProps {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  children: React.ReactNode;
  buttonLabel: string;
  title: string;
  full?: boolean;
  fullWidth?: boolean;
  buttonColor?: "blue" | "red" | "green" | "yellow" | "gray";
  buttonPadding?: string;
  dark?: boolean;
  closeOnTitle?: boolean;
}

export default function AppDialog({
  isOpen,
  openModal,
  closeModal,
  children,
  buttonLabel,
  title,
  full = false,
  fullWidth = false,
  buttonColor = "blue",
  buttonPadding,
  dark = false,
  closeOnTitle = false,
}: AppDialogProps) {
  if (buttonLabel === "") {
    return (
      <>
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10 " onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel
                    className={`w-full max-w-md transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all ${
                      fullWidth ? "min-w-full" : ""
                    } ${
                      dark
                        ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700"
                        : ""
                    }`}
                  >
                    <Dialog.Title
                      as="h3"
                      className="text-lg flex justify-between font-extrabold leading-6 text-gray-900"
                    >
                      {title}

                      {closeOnTitle && (
                        <IconButton
                          onClick={closeModal}
                          icon={
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          }
                        />
                      )}
                    </Dialog.Title>
                    <div className="mt-2">{children}</div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    );
  } else {
    return (
      <>
        <div
          className={`${
            full ? "w-full" : ""
          } inset-0 flex items-center justify-center`}
        >
          <Button
            padding={buttonPadding}
            bold
            full
            color={buttonColor}
            type="button"
            onClick={openModal}
          >
            {buttonLabel}
          </Button>
        </div>

        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10 " onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel
                    className={`w-full max-w-md transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all ${
                      fullWidth ? "min-w-full" : ""
                    } ${
                      dark
                        ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700"
                        : ""
                    }`}
                  >
                    <Dialog.Title
                      as="h3"
                      className="text-lg flex justify-between font-extrabold leading-6 text-gray-900"
                    >
                      {title}

                      {closeOnTitle && (
                        <IconButton
                          onClick={closeModal}
                          icon={
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          }
                        />
                      )}
                    </Dialog.Title>
                    <div className="mt-2">{children}</div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    );
  }
}
