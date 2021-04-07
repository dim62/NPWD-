import { useNuiEvent } from 'fivem-nui-react-lib';
import { useSetRecoilState } from 'recoil';
import { exampleState } from './state';
import { useExample } from './useExample';

export const useExampleService = () => {
  const setExample = useSetRecoilState(exampleState.example);
  useNuiEvent('EXAMPLE', 'setExample', setExample);
  return useExample();
};

// call this function in the Phone.tsx file.
