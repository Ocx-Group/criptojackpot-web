import TwoFactorSection from "@/features/auth/components/TwoFactorSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verificación 2FA - CriptoJackpot",
  description: "Verificación en dos pasos",
};

const Verify2Fa = () => {
  return (
    <div>
      <TwoFactorSection />
    </div>
  );
};

export default Verify2Fa;
