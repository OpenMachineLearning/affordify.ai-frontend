import React, { useEffect, useRef } from "react";

interface StepperDialogProps {
  authorizationCode?: string;
  closeDialog?: () => void;
  isManualDialogOpen?: boolean;
  closeManualDialog?: () => void;
}

export default function StepperDialog({
  authorizationCode,
  closeDialog,
}: StepperDialogProps) {
  const clientId = process.env.NEXT_PUBLIC_TINK_CLIENT_ID;
  const dialogRef = useRef<HTMLDivElement>(null);

  // Handle click outside for automatic dialog
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node) &&
        closeDialog
      ) {
        closeDialog();
      }
    };

    if (authorizationCode && closeDialog) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [authorizationCode, closeDialog]);

  return (
    <>
      {/* Automatic Connection Dialog */}
      {authorizationCode && closeDialog && (
        <div className="fixed inset-0 bg-[#2a2a337a] bg-opacity-50 flex items-center justify-center">
          <div
            ref={dialogRef}
            className="modal-content bg-white p-0 rounded-lg shadow-lg w-[550px]"
          >
            <iframe
              src={`https://link.visa.com/1.0/transactions/connect-accounts?client_id=${clientId}&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}&authorization_code=${authorizationCode}&market=US`}
              className="w-full h-[600px]"
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
}
