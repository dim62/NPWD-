import { FormattedMatch, MatchEvents } from '../../../../../typings/match';
import { fetchNui } from '../../../utils/fetchNui';
import { ServerPromiseResp } from '../../../../../typings/common';
import { useSetFormattedProfiles, useSetMatches } from './state';
import { useSnackbar } from '../../../ui/hooks/useSnackbar';
import { useCallback } from 'react';

export const useMatchActions = () => {
  const setProfiles = useSetFormattedProfiles();
  const setMatches = useSetMatches();
  const { addAlert } = useSnackbar();

  const setViewed = useCallback(
    (id: number, liked: boolean) => {
      setProfiles((profiles) =>
        profiles.map((profile) => {
          if (id === profile.id) return { ...profile, viewed: true, liked };
          return profile;
        }),
      );

      fetchNui<ServerPromiseResp<boolean>>(MatchEvents.SAVE_LIKES, [{ id, liked }]).then((resp) => {
        if (resp.status !== 'ok') {
          return addAlert({
            message: 'APPS_MATCH_SAVE_LIKES_FAILED',
            type: 'error',
          });
        }

        // Instead of just fetching the matches again, we might want to first format the profile to a 'Match',then to a 'FormattedMatch'
        // and then just mutate the already existing state of matches?
        // I guess that's for another time :P

        if (resp.data) {
          addAlert({
            message: 'APPS_MATCH_NEW_LIKE_FOUND',
            type: 'info',
          });
          fetchNui<ServerPromiseResp<FormattedMatch[]>>(MatchEvents.GET_MATCHES).then((resp) => {
            setMatches(resp.data);
          });
        }
      });
    },
    [setProfiles, addAlert, setMatches],
  );

  return {
    setViewed,
  };
};
