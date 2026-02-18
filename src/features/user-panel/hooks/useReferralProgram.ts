import { useUserStore } from '@/store/userStore';
import { userReferralService } from '@/services';
import { UserReferralStats } from '@/features/user-panel/types';
import { useQuery } from '@tanstack/react-query';
import { useNotificationStore } from '@/store/notificationStore';
import { useTranslation } from 'react-i18next';

export const useReferralProgram = () => {
  const { t } = useTranslation();

  const { user } = useUserStore();
  const showNotification = useNotificationStore(state => state.show);

  const baseUrl =
    typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.host}`
      : 'https://cryptojackpot.com';

  const referralLink = user?.userGuid ? `${baseUrl}/register/${user.userGuid}` : `${baseUrl}`;

  const { data: referralData, isLoading: isReferralsLoading } = useQuery<UserReferralStats>({
    queryKey: ['userReferrals', user?.id],
    queryFn: () => userReferralService.getUserReferralsAsync(user!.id || 0),
    enabled: !!user?.id,
  });

  const copyToClipboard = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink).then();
      showNotification('success', t('REFERRAL_PROGRAM.linkCopied'), '');
    }
  };

  return {
    referralLink,
    copyToClipboard,
    hasSecurityCode: !!user?.userGuid,
    referralData,
    isReferralsLoading,
  };
};
