import * as http from '../lib/http';
import * as t from 'io-ts';

import * as authApi from './auth';
import * as config from './config';

export type AppReport = {
  reportedId: string;
  contact: string;
  description: string;
};

type ApiReport = {
  reported_user_id: string;
  reporter_user_id: string;
  contact_field: string;
  report_reason: string;
};

const toApiReport = (
  { reportedId, contact, description }: AppReport,
  userId: string,
): ApiReport => ({
  reported_user_id: reportedId,
  reporter_user_id: userId,
  contact_field: contact,
  report_reason: description,
});

export const reportUser =
  (report: AppReport) => (token: authApi.AccessToken) => {
    const url = `${config.baseUrl}/reports`;

    return http.validateResponse(
      http.post(url, toApiReport(report, token.userId), {
        headers: authApi.authHeader(token),
      }),
      t.any,
      _ => true as const,
    );
  };
