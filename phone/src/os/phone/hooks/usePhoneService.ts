import { useSetRecoilState } from 'recoil';
import { phoneState } from './state';
import { useNuiEvent } from '../../nui-events/hooks/useNuiEvent';

export const usePhoneService = () => {
  const setVisibility = useSetRecoilState(phoneState.visibility);
  const setPhoneConfig = useSetRecoilState(phoneState.phoneConfig);
  useNuiEvent('PHONE', 'setVisibility', setVisibility);
  useNuiEvent('PHONE', 'phoneConfig', setPhoneConfig);
};
