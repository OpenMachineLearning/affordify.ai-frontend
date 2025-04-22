import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

export const useBankConnection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isManualDialogOpen, setIsManualDialogOpen] = useState(false);
  const [authorizationCode, setAuthorizationCode] = useState("");
  const [externalUser_id, setExternalUser_id] = useState("");
  const { getToken } = useAuth();



  const handleBankConnect = async () => {
    const token = await getToken();
    const userMarket = "US";
    const userLocale = "en_US";
    try {
      const response = await fetch( `${process.env.NEXT_PUBLIC_API_URL}/api/tink/connect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ locale: userLocale, market: userMarket }),
      });
      const data = await response.json();
      setAuthorizationCode(data.code);
      setExternalUser_id (data.external_user_id)
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error initiating bank connection:", error);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const openManualDialog = () => {
    setIsManualDialogOpen(true);
  };

  const closeManualDialog = () => {
    setIsManualDialogOpen(false);
  };

  return {
    isDialogOpen,
    closeDialog,
    handleBankConnect,
    authorizationCode,
    externalUser_id,
    isManualDialogOpen,
    openManualDialog,
    closeManualDialog,
  };
};