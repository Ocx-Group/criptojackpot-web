import { useUserStore } from '@/store/userStore';
import { userService, userReferralService } from '@/services';
import { GenerateNewSecurityCodeRequest, UserReferralStats } from '@/features/user-panel/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNotificationStore } from '@/store/notificationStore';
import { useTranslation } from 'react-i18next';

export const useReferralProgram = () => {
  const { t } = useTranslation();

  const { user, updateUser } = useUserStore();
  const showNotification = useNotificationStore(state => state.show);

  const baseUrl =
    typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.host}`
      : 'https://cryptojackpot.com';

  const referralLink = user?.securityCode ? `${baseUrl}/register/${user.securityCode}` : `${baseUrl}`;

  const { data: referralData, isLoading: isReferralsLoading } = useQuery<UserReferralStats>({
    queryKey: ['userReferrals', user?.id],
    queryFn: () => userReferralService.GetUserReferralsAsync(user!.id || 0),
    enabled: !!user?.id,
  });

  const { mutate: generateNewSecurityCode, isPending: isGenerating } = useMutation({
    mutationFn: () => {
      if (!user?.id) throw new Error('User ID is not available');

      const request: GenerateNewSecurityCodeRequest = {
        userId: user.id,
      };
      return userService.generateNewSecurityCode(request);
    },
    onSuccess: updatedUser => {
      updateUser(updatedUser);
      showNotification('success', t('REFERRAL_PROGRAM.generateNewCodeSuccess'), '');
    },
    onError: error => {
      console.error('Error generating new security code:', error);
      showNotification('error', t('REFERRAL_PROGRAM.generateNewCodeError'), '');
    },
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
    generateNewSecurityCode,
    isGenerating,
    hasSecurityCode: !!user?.securityCode,
    referralData,
    isReferralsLoading,
  };
};
