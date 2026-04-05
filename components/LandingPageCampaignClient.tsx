"use client";

import { useState } from "react";
import { CampaignFloatingBadge, CampaignPopup } from "./VideoCampaignBanner";

export const LandingPageCampaignClient = ({ isPaid }: { isPaid?: boolean }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  if (isPaid) return null;

  return (
    <>
      <CampaignFloatingBadge onClick={() => setIsPopupOpen(true)} />
      <CampaignPopup 
        isManualTrigger={isPopupOpen} 
        onCloseRequested={() => setIsPopupOpen(false)} 
      />
    </>
  );
};
